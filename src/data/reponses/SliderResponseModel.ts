import { SliderModel } from '../models/SliderModel';

export interface SliderResponseModel {
  status: string;
  data?: SliderModel[];
  message: string;
  code: number;
}
