import { NgBattleshipPage } from './app.po';

describe('ng-battleship App', function() {
  let page: NgBattleshipPage;

  beforeEach(() => {
    page = new NgBattleshipPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
