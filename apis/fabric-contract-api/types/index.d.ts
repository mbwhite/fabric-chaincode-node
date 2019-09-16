/*
 Copyright 2018 IBM All Rights Reserved.

 SPDX-License-Identifier: Apache-2.0

*/

declare module 'fabric-contract-api' {
    import { LoggerInstance } from 'winston';
    import { ChaincodeStub, ClientIdentity } from 'fabric-shim-api';

    export class Context {
        stub: ChaincodeStub;
        clientIdentity: ClientIdentity;
        logger: {
            setLevel: (level: string) => void,
            getLogger: (name?: string) => LoggerInstance
        }
    }

    export class Contract {
        constructor(name?: string);

        static _isContract(): boolean;

        beforeTransaction(ctx : Context): Promise<void>;
        afterTransaction(ctx : Context,result: any): Promise<void>;

        unknownTransaction(ctx : Context): Promise<void>;

        createContext(): Context;
        getName(): string;

    }

    export function Transaction(commit?: boolean): (target: any, propertyKey: string | symbol) => void;
    export function Param(paramName: string, paramType: string, description?: string): (target: any, propertyKey: string | symbol) => void;
    export function Returns(returnType?: string): (target: any, propertyKey: string | symbol) => void;
    export function Object(type?: string): (target: any) => void;
    export function Info(info?: object): (target: any) => void;
    export function Property(name?: string, type?: string): (target: any, propertyKey: string | symbol) => void;
    export function Default(): (target: any) => void;
}
