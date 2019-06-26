import React from 'react';
import { mount } from 'enzyme';
import FormFlowProvider from '../src/FormFlowProvider';

describe('<FormFlowProvider />', () => {
  describe('getI18n should return default "en" for no entry in localeData', () => {
    let value;
    it('Given getI18n is executed to localeData with no "fr" and lang "fr"', () => {
      value = getI18n('en', 'fr', localeData);
    });
    it('Expect locale be "en"', () => {
      expect(value).to.be.eql('en');
    });
  });

  describe('localise to create a new component with different localisation ', () => {
    const localisationData = {
      pt: { name: 'Dan_en' },
    };
    const Name = ({ i18n }) => <span>{i18n.name}</span>;
    const NameLocalised = localise(localisationData)(Name);
    NameLocalised.extend({ pt: { name: 'Dan_pt' } });
    const NameFactoredLocalised = NameLocalised.factory({ pt: { name: 'Dan_pt_factored' } });
    let element;
    it('Given I rendered an extended and a factored localised components', () => {
      element = mount(
        <div>
          <I18nProvider defaultLanguage="pt">
            <NameLocalised />
            <NameFactoredLocalised />
          </I18nProvider>
        </div>
      );
    });
    it('Expect the extended component to have content "Dan_pt"', () => {
      assertComponentContent(element, NameLocalised, 'Dan_pt');
    });
    it('And the factored component to have content "Dan_pt_factored"', () => {
      assertComponentContent(element, NameFactoredLocalised, 'Dan_pt_factored');
    });
  });
});
