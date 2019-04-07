import * as form from './form';
describe('form validate test', () => {
  it('check person card id', () => {
    expect(form.checkIdCard('510184199006117319')).toEqual(true);
    expect(form.checkIdCard('510184199006117318')).toEqual(false);
  });
  it('check phone', () => {
    expect(form.checkPhone('18202810233')).toEqual(true);
    expect(form.checkPhone('11202810233')).toEqual(false);
    expect(form.checkPhone('182028102331')).toEqual(false);
  });
  it('check email', () => {
    expect(form.checkEmail('584778883@qq.com')).toEqual(true);
    expect(form.checkEmail('584778883@.com')).toEqual(false);
    expect(form.checkEmail('584778883@qqcom')).toEqual(false);
  });
  it('checkCharaterLower', () => {
    expect(form.checkCharaterLower('a')).toEqual(true);
    expect(form.checkCharaterLower('A')).toEqual(false);
    expect(form.checkCharaterLower('1')).toEqual(false);
    expect(form.checkCharaterLower('.')).toEqual(false);
    let data = 1;
    expect(form.checkCharaterLower(<any>data)).toEqual(false);
  });
  it('checkCharaterUpper', () => {
    expect(form.checkCharaterUpper('A')).toEqual(true);
    expect(form.checkCharaterUpper('Z')).toEqual(true);
    expect(form.checkCharaterUpper('ZA')).toEqual(false);
    expect(form.checkCharaterUpper('a')).toEqual(false);
    expect(form.checkCharaterUpper('1')).toEqual(false);
    let data = 1;
    expect(form.checkCharaterLower(<any>data)).toEqual(false);
  });
  it('checkJustNumberCharacter', () => {
    // expect(form.checkJustCharater)
  });
});
