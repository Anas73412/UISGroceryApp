import { Q } from '@nozbe/watermelondb';
import { database } from '../../database';
import { DB_TABLES } from '../../utils/constants';
import { AddressModel, AddressResponseModel } from '../models/AddressModel';
import { ResponseModel } from '../reponses/ResponseModel';

class AddressRepository {
  async saveAllAddressInDB(addresses: AddressResponseModel[]) {
    return database.write(async () => {
      const addresstable = database.get(DB_TABLES.ADDRESS_TABLE);
      try {
        const existingAddresses = await addresstable.query().fetch();
        await Promise.all(
          existingAddresses.map(record => record.destroyPermanently()),
        );
      } catch (error) {
        console.error(
          'Error occurred while fetching existing addresses:',
          error,
        );
      }

      for (const address of addresses) {
        await addresstable.create(record => {
          const newAddress = record as AddressModel;

          newAddress.uId = address.addressId;
          newAddress.userId = address.userId;
          newAddress.addressId = address.addressId;
          newAddress.status = address.status;
          newAddress.houseNo = address.houseNo;
          newAddress.buildingName = address.buildingName;
          newAddress.landmark = address.landmark;
          newAddress.addressType = address.addressType;
          newAddress.otherAddressType = address.otherAddressType;
          newAddress.receiverName = address.receiverName;
          newAddress.receiverMobile = address.receiverMobile;
          newAddress.pincode = address.pincode;
          newAddress.latitude = address.latitude;
          newAddress.longtitude = address.longtitude;
          newAddress.mapAddress = address.mapAddress;
          newAddress.distance = address.distance;
        });
      }
    });
  }

  async saveAddressInDB(address: AddressResponseModel) {
    return database.write(async () => {
      const table = database.get(DB_TABLES.ADDRESS_TABLE);

      const existingAddresses = await table.query().fetch();
      await Promise.all(
        existingAddresses.map(record => record.destroyPermanently()),
      );

      if (address !== null) {
        await table.create(record => {
          const newAddress = record as AddressModel;

          newAddress.uId = address.addressId;
          newAddress.userId = address.userId;
          newAddress.addressId = address.addressId;
          newAddress.status = address.status;
          newAddress.houseNo = address.houseNo;
          newAddress.buildingName = address.buildingName;
          newAddress.landmark = address.landmark;
          newAddress.addressType = address.addressType;
          newAddress.otherAddressType = address.otherAddressType;
          newAddress.receiverName = address.receiverName;
          newAddress.receiverMobile = address.receiverMobile;
          newAddress.pincode = address.pincode;
          newAddress.latitude = address.latitude;
          newAddress.longtitude = address.longtitude;
          newAddress.mapAddress = address.mapAddress;
          newAddress.distance = address.distance;
        });
      }
    });
  }

  async getUserAddressDetails(
    userId: number,
    addressId: number,
  ): Promise<AddressModel | null> {
    const addresses = await database
      .get(DB_TABLES.ADDRESS_TABLE)
      .query(Q.where('userId', userId), Q.where('addressId', addressId))
      .fetch();

    return addresses.length > 0 ? (addresses[0] as AddressModel) : null;
  }

  async getAllUserAddressDetails(userId: number): Promise<AddressModel[] | []> {
    const addresses = await database
      .get(DB_TABLES.ADDRESS_TABLE)
      .query(Q.where('userId', userId))
      .fetch();

    return addresses.length > 0 ? (addresses as AddressModel[]) : [];
  }

  async deleteAddressFromDB(
    userId: number,
    addressId: number,
  ): Promise<ResponseModel> {
    try {
      const address = await database
        .get(DB_TABLES.ADDRESS_TABLE)
        .query(Q.where('userId', userId), Q.where('addressId', addressId))
        .fetch();
      if (address === null) {
        return {
          status: false,
          message: 'Address not found. Please try again',
        };
      }

      await database.write(async () => {
        await address[0].destroyPermanently();
      });
      return {
        status: true,
        message: 'Address deleted successfully',
      };
    } catch (error: any) {
      return {
        status: false,
        message: error,
      };
    }
  }

  async updateAddressInDB(
    userId: number,
    addressId: number,
    newAddress: AddressResponseModel,
  ): Promise<ResponseModel> {
    try {
      const address = await this.getUserAddressDetails(userId, addressId);
      if (address === null) {
        return {
          status: false,
          message: 'Address not found. Please try again',
        };
      }

      await database.write(async () => {
        await address.update((record: AddressModel) => {
          record.houseNo = newAddress.houseNo;
          record.buildingName = newAddress.buildingName;
          record.landmark = newAddress.landmark;
          record.addressType = newAddress.addressType;
          record.otherAddressType = newAddress.otherAddressType;
          record.receiverName = newAddress.receiverName;
          record.receiverMobile = newAddress.receiverMobile;
          record.pincode = newAddress.pincode;
          record.latitude = newAddress.latitude;
          record.longtitude = newAddress.longtitude;
          record.mapAddress = newAddress.mapAddress;
          record.distance = newAddress.distance;
        });
      });

      return {
        status: true,
        message: 'Address updated successfully',
      };
    } catch (error: any) {
      return {
        status: false,
        message: error,
      };
    }
  }
}

export default new AddressRepository();
