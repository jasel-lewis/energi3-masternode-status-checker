import cases from './test-cases.js';

let testCount = 0;
let succeededCount = 0;
let failedCount = 0;

const reporter = (objPreface, obj, msg) => {
    objPreface && objPreface.length && console.log(objPreface);
    obj && console.log(obj)
    console.log(msg);
};

const caseRunner = async (testcase) => {
    testCount++;
    await testcase()
        .then(({ objPreface, obj, msg }) => {
            succeededCount++;
            reporter(objPreface, obj, msg && msg.length ? msg : 'Succeeded.');
        })
        .catch(({ objPreface, obj, msg }) => {
            failedCount++;
            reporter(objPreface, obj, `Failed. ${msg && msg.length ? msg : ''}`)
        });
    console.log('\n');
};

await caseRunner(cases.testCase01);
await caseRunner(cases.testCase02);
await caseRunner(cases.testCase03);
await caseRunner(cases.testCase04);
await caseRunner(cases.testCase05);
await caseRunner(cases.testCase06);
await caseRunner(cases.testCase07);
await caseRunner(cases.testCase08);
await caseRunner(cases.testCase09);

console.log(`*** Out of ${testCount} test${testCount != 1 ? 's' : ''}, ${succeededCount} succeeded and ${failedCount} failed.\n`);
