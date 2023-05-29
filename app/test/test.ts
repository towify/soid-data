/*
 * @author kaysaith
 * @date 12/17/20 10:44
 */

import {Shared} from '../storage/shared-preference';
import {Performance} from '../util/performance';
import {ValueChecker} from '../util/value.checker';
import {NanoIdHelper} from '../util/nanoid.utils';
import {RequestHelper} from '../manager/request.helper';

function extractContent(input: string): string[] {
  const lines = input.trim().split('\n').filter(item => item);
  const contents: string[] = [];
  for (const line of lines) {
    const jsonString = line.slice('data: '.length);
    if (jsonString.startsWith('{')) {
      const apiResponse: { [key: string]: any } = JSON.parse(jsonString);
      for (const choice of apiResponse.choices) {
        if (choice.delta.content) {
          contents.push(choice.delta.content);
        }
      }
    }
  }
  return contents;
}

describe('soid-data', () => {
  it('request', async () => {
    const result = await RequestHelper.request(
      'post',
      'https://api.openai.com/v1/chat/completions',
      undefined,
      {
        messages: [{ role: 'user', content: '你是谁？' }],
        model: 'gpt-4',
        stream: true
      },
      {
        headers: {
          'Authorization': 'Bearer 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'
        }
      },
      result => {
        console.log(result, 'result')
      }
    );
  }, 40000);

  it('getSharedPreference', async () => {
    await Shared.save('some_data', 'some data');
    expect(Shared.get('some_data') === 'some data');
  });
  it('nanoid', () => {
    const shortId = NanoIdHelper.short();
    console.log(shortId, 'short id');
    expect(shortId.length === 16);
  });
});

describe('performance', () => {
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
    throttleFunction();
    throttleFunction();
    throttleFunction();
    throttleFunction();
    jest.runAllTimers();

    expect(count === 4);
  });

  it('delay', () => {

    let count = 0;
    Performance.delay(200).then(() => {
      count = 1;
    });

    expect(count === 1);
  });
});

describe('checker', () => {
  it('HexColor', () => {
    let isHexColor = ValueChecker.isHexColor('#FFB6C1');
    expect(isHexColor === true);
  });

  it('RGBAColor', () => {
    let isRFBAColor = ValueChecker.isRGBAColor('rgb(12,33,41)');
    expect(isRFBAColor === true);
  });

  it('email', () => {
    let isEmail = ValueChecker.isEmail('towify@.google.com');
    expect(isEmail === true);
  });
});
