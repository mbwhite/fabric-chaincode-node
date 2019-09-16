/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const sinon = require('sinon');
const rewire = require('rewire');

const ObjectAnnotations = rewire('./../../../lib/annotations/object');
const Object = ObjectAnnotations.Object;
const Property = ObjectAnnotations.Property;

const utils = require('../../../lib/annotations/utils');

describe ('Object.js', () => {

    const mockTarget = {
        name: 'steve'
    };

    let sandbox;
    let defineMetadataStub;
    let getMetadataStub;
    beforeEach(() => {
        sandbox = sinon.createSandbox();
        getMetadataStub = sandbox.stub(Reflect, 'getMetadata');
        defineMetadataStub = sandbox.stub(Reflect, 'defineMetadata');
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('#Object', () => {

        let object;

        beforeEach(() => {
            object = Object();
        });

        it ('should add object as key when no objects exist for global yet', () => {
            getMetadataStub
                .onFirstCall().returns(undefined)
                .onSecondCall().returns({'some': 'properties'});

            object(mockTarget);

            sinon.assert.calledTwice(getMetadataStub);
            sinon.assert.calledWith(getMetadataStub, 'fabric:objects', global);
            sinon.assert.calledWith(getMetadataStub, 'fabric:object-properties', mockTarget.prototype);
            sinon.assert.calledOnce(defineMetadataStub);
            sinon.assert.calledWith(defineMetadataStub, 'fabric:objects', {
                'steve':  {
                    $id: 'steve',
                    additionalProperties: false,
                    properties: {'some': 'properties'},
                    type: 'object'
                }
            });
        });

        it ('should add object as key when objects exist for global', () => {
            getMetadataStub
                .onFirstCall().returns({'object1': {}})
                .onSecondCall().returns(undefined);

            object(mockTarget);

            sinon.assert.calledTwice(getMetadataStub);
            sinon.assert.calledWith(getMetadataStub, 'fabric:objects', global);
            sinon.assert.calledWith(getMetadataStub, 'fabric:object-properties', mockTarget.prototype);
            sinon.assert.calledOnce(defineMetadataStub);
            sinon.assert.calledWith(defineMetadataStub, 'fabric:objects', {
                'object1': {},
                'steve':  {
                    $id: 'steve',
                    additionalProperties: false,
                    properties: {},
                    type: 'object'
                }
            });
        });
    });

    describe('#Property', () => {
        let generateSchemaStub;

        beforeEach(() => {
            generateSchemaStub = sandbox.stub(utils, 'generateSchema').returns('some new schema');
        });

        it ('should use the type and name passed', () => {
            getMetadataStub.onFirstCall().returns({'some': 'properties'});

            Property('some name', 'SoMe tYPe')(mockTarget);

            sinon.assert.calledOnce(getMetadataStub);
            sinon.assert.calledWith(getMetadataStub, 'fabric:object-properties', mockTarget);
            sinon.assert.calledOnce(generateSchemaStub);
            sinon.assert.calledWith(generateSchemaStub, 'SoMe tYPe');
            sinon.assert.calledWith(defineMetadataStub, 'fabric:object-properties', {
                'some': 'properties',
                'some name': 'some new schema'
            });
        });

        it ('should handle the reflected type being a function when type not passed and is function', () => {
            getMetadataStub
                .onFirstCall().returns(undefined)
                .onSecondCall().returns(function Fred() {});


            Property('some name')(mockTarget, 'some key');
            sinon.assert.calledTwice(getMetadataStub);
            sinon.assert.calledWith(getMetadataStub, 'fabric:object-properties', mockTarget);
            sinon.assert.calledWith(getMetadataStub, 'design:type', mockTarget, 'some key');
            sinon.assert.calledOnce(generateSchemaStub);
            sinon.assert.calledWith(generateSchemaStub, 'Fred');
            sinon.assert.calledWith(defineMetadataStub, 'fabric:object-properties', {
                'some key': 'some new schema'
            });
        });

        it ('should handle the reflected type being a function when type not passed and is not function', () => {
            getMetadataStub
                .onFirstCall().returns(undefined)
                .onSecondCall().returns('soMe TyPe');


            Property()(mockTarget, 'some key');
            sinon.assert.calledTwice(getMetadataStub);
            sinon.assert.calledWith(getMetadataStub, 'fabric:object-properties', mockTarget);
            sinon.assert.calledWith(getMetadataStub, 'design:type', mockTarget, 'some key');
            sinon.assert.calledOnce(generateSchemaStub);
            sinon.assert.calledWith(generateSchemaStub, 'soMe TyPe');
            sinon.assert.calledWith(defineMetadataStub, 'fabric:object-properties', {
                'some key': 'some new schema'
            });
        });
    });
});
