/*
 Copyright 2018 IBM All Rights Reserved.

 SPDX-License-Identifier: Apache-2.0

*/
declare module 'fabric-ledger-api' {
    import { SerializedIdentity, ChaincodeProposal } from "fabric-shim-api";

    interface Collection {
        getState(key: string): Promise<State>;
        putState(key: string, value: State): Promise<void>;
        deleteState(key: string): Promise<void>;

        getStateRange(startKey: string, endKey: string): Promise<Iterators.StateQueryIterator>
        getStateRangeFrom(startKey: string): Promise<Iterators.StateQueryIterator>
        getStateRangeTo(startKey: string): Promise<Iterators.StateQueryIterator>

        getQueryResult(query: string): Promise<Iterators.StateQueryIterator>
        getHistory(key: string): Promise<Iterators.StateModificationIterator>
    }

    class Ledger {
        static getLedger(name?: string): Ledger;
        getCollection(name?: string): Collection;        
        invokeChaincode(chaincodeName: string, args: string[], channel: string): Promise<ChaincodeResponse>;
    }

    interface State {
        getPrivateDataHash(collection: string, key: string): Promise<Uint8Array>;
        setStateValidationParameter(key: string, ep: Uint8Array): Promise<void>;
        getStateValidationParameter(key: string): Promise<Uint8Array>;
    }

    class CompositeStateKey {
        objectType: string;
        attributes: string[];
        static makeComposite(partial?: boolean, ...attributes: string[]): CompositeStateKey
    }

    interface Transaction {
        getArgs(): string[];
        getStringArgs(): string[];
        getFunctionAndParameters(): { params: string[], fcn: string };

        getTxID(): string;
        getChannelID(): string;
        getCreator(): SerializedIdentity;
        getTransient(): Map<string, Uint8Array>;

        getSignedProposal(): ChaincodeProposal.SignedProposal;
        getTxTimestamp(): Timestamp;
        getBinding(): string;

        setEvent(name: string, payload: Uint8Array): void;

    }

    namespace Iterators {
        type StateModificationIterator = CommonIterator<StateModification>;
        type StateQueryIterator = CommonIterator<State>;

        interface CommonIterator<T> {
            close(): Promise<void>;
            next(): Promise<NextResult<T>>;
        }

        interface NextResult<T> {
            value: T;
            done: boolean;
        }

        interface NextKeyModificationResult {
            value: StateModification;
            done: boolean;
        }

        interface StateModification {
            isDelete: boolean;
            value: Uint8Array;
            timestamp: Timestamp;
            txId: string;
        }
    }

    interface Timestamp {
        seconds: number;
        nanos: number;
    }
}
