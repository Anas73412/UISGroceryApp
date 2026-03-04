export interface ApiResponseModel<T>{
    code:number;
    status:string;
    message:string;
    data:T | null;
}