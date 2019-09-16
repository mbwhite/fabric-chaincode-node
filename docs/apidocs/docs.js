/*
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
*/
/* eslint-disable no-console */
const gulp = require('gulp');
const jsdoc = require('gulp-jsdoc3');
const fs = require('fs-extra');
const path = require('path');
const replace = require('gulp-replace');
let currentBranch = process.env.GERRIT_BRANCH;

if (!currentBranch) {
    currentBranch = 'master';
}

let docsRoot;
if (process.env.DOCS_ROOT) {
    docsRoot = process.env.DOCS_ROOT;
} else {
    docsRoot = './_out';
}

const clean = () => {
    return fs.remove(path.join(docsRoot, currentBranch));
};

const docSrc = [
    './README.md',
    '../../libraries/fabric-shim/lib/chaincode.js',
    '../../libraries/fabric-shim/lib/stub.js',
    '../../libraries/fabric-shim/lib/iterators.js',
    '../../apis/fabric-contract-api/lib/**/*.js'
];

const jsdocs = () => {
    return gulp.src(docSrc, { read: false }).pipe(jsdoc({
        opts: {
            tutorials: './tutorials',
            destination: path.join(docsRoot, currentBranch)
        },
        templates: {
            systemName: 'Hyperledger Fabric Node.js Contract and Shim',
            theme: 'cosmo'
        },
    })
    );
}

const schemaDocs = () => {
    return gulp.src('fabric-contract-api/schema/contract-schema.json')
        .pipe(gulp.dest(path.join(docsRoot, currentBranch)));
};

// for the rare occurance where something needs to be bootsrap in the docs ahead of a release
gulp.task('bootstrap', function () {
    gulp.src('./docs/bootstrap/**/*').pipe(gulp.dest(docsRoot));
});

exports.docs = gulp.series(clean, jsdocs);
// gulp.task('docs', gulp.series(['jsdocs', 'schema-docs', , () => {

//     const relativePath = '.';
//     const packageJson = require(path.join(__dirname, '..', '..', 'package.json'));
//     let mapping = ['ClientIdentity',
//         'ChaincodeFromContract',
//         'CommonIterator',
//         'ChaincodeInterface',
//         'ChaincodeStub',
//         'HistoryQueryIterator',
//         'ChaincodeStub.SignedProposal',
//         'Shim',
//         'Meta',
//         'StateQueryIterator'
//     ];

//     mapping = mapping.map((e) => {
//         return `'${e}.html'`;
//     });

//     // jsdocs produced
//     // if this is the master build then we need to ensure that the index.html and
//     // the 404.html page are properly setup and configured.
//     // also copies the
//     if (currentBranch === 'master') {
//         const pathToReleasedSchema = path.resolve(docsRoot, packageJson.docsLatestVersion, 'contract-schema.json');
//         return gulp.src(['./docs/redirectTemplates/*.html', pathToReleasedSchema])
//             .pipe(replace('LATEST__VERSION', packageJson.docsLatestVersion))
//             .pipe(replace('FILENAME__MAPPING', mapping.join(',')))
//             .pipe(replace('RELATIVE__PATH', relativePath))
//             .pipe(gulp.dest(docsRoot));
//     } else {
//         console.log(`Not updating or routing logic, as not master branch - it is ${currentBranch}`);
//     }
// }));

