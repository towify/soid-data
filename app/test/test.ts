/*
 * @author kaysaith
 * @date 12/17/20 10:44
 */

import {Shared} from "../storage/shared_preference";
import {Performance} from "../util/performance";

describe('soid-data', () => {
  it('getSharedPreference', async () => {
    await Shared.save('some_data', 'some data');
    expect(Shared.get('some_data') === 'some data');
  });

});

describe('performance',()=>{
  it('debounce', () => {
    let count = 0;
    const debounceFunction = Performance.debounce(() => {
      count += 1;
    }, 200);

    jest.useFakeTimers();
    setTimeout(debounceFunction, 0);
    setTimeout(debounceFunction, 100);
    setTimeout(debounceFunction, 300);
    jest.runAllTimers();
    expect(count).toEqual(2);
  });

  it('throttle', () => {
    let count = 0;
    const throttleFunction = Performance.throttle(() => {
      count += 1;
    }, 200);

    jest.useFakeTimers();
    throttleFunction()
    throttleFunction()
    throttleFunction()
    throttleFunction()
    jest.runAllTimers();

    expect(count === 4);
  });

  it('delay',()=> {

    let count = 0;
    Performance.delay(200).then(() => {
      count = 1;
    });

    expect(count === 1);
  });
})
