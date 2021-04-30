/*
 * @author kaysaith
 * @date 12/17/20 10:44
 */

import {Shared} from "../storage/shared_preference";
import {ValueChecker} from "../util/value_checker";

describe('soid-data', () => {
  it('getSharedPreference', async () => {
    await Shared.save('some_data', 'some data');
    expect(Shared.get('some_data') === 'some data');
  });

});

describe('checker',()=> {
  it('HexColor', () => {
    let isHexColor = ValueChecker.isHexColor('#FFB6C1');
    expect(isHexColor === true);
  });

  it('RGBAColor', () => {
    let isRFBAColor = ValueChecker.isRGBAColor('rgb(12,33,41)')
    expect(isRFBAColor === true)
  });

  it('email',()=> {
    let isEmail = ValueChecker.isEmail('towify@.google.com');
    expect(isEmail === true)
  });
})
