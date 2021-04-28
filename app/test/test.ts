/*
 * @author kaysaith
 * @date 12/17/20 10:44
 */

import {Shared} from "../storage/shared_preference";

describe('soid-data', () => {
    it('getSharedPreference', async () => {
        await Shared.save('some_data', 'some data');
        expect(Shared.get('some_data') === 'some data');
    });
});
