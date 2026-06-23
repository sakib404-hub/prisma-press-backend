interface TMeta {
    page : number;
    limit : number;
    total : number;
}

export interface IResponse2<T>{
    success : boolean;
    statusCode : number;
    message : string ;
    data ? : T;
    meta ? : TMeta
}

export interface TResponseData<T> {
    success : boolean;
    statusCode : number;
    message : string ;
    data ? : T;
    meta ? : TMeta
}