import { MapTrialPage } from './app.po';

describe('map-trial App', function() {
  let page: MapTrialPage;

  beforeEach(() => {
    page = new MapTrialPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
