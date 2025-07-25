import { baseImpressionVerifier, PB_PREFIX } from 'modules/videoModule/videoImpressionVerifier.js';

let trackerMock;

function resetTrackerMock() {
  const model = {};
  trackerMock = {
    store: sinon.spy((key, value) => { model[key] = value; }),
    remove: sinon.spy(key => {
      const value = model[key];
      if (value) {
        delete model[key];
        return value;
      }
    })
  };
}

describe('Base Impression Verifier', function() {
  beforeEach(function () {
    resetTrackerMock();
  });
  describe('trackBid', function () {
    it('should generate uuid', function () {
      const baseVerifier = baseImpressionVerifier(trackerMock);
      const uuid = baseVerifier.trackBid({});
      expect(uuid.substring(0, 3)).to.equal(PB_PREFIX);
      expect(uuid.length).to.be.lessThan(16);
    });
  });

  describe('getBidIdentifiers', function () {
    it('should match ad id to uuid', function () {
      const baseVerifier = baseImpressionVerifier(trackerMock);
      const bid = { adId: 'a1', adUnitCode: 'u1' };
      const uuid = baseVerifier.trackBid(bid);
      const result = baseVerifier.getBidIdentifiers(uuid);
      expect(result).to.deep.equal({ adId: 'a1', adUnitCode: 'u1', requestId: undefined, auctionId: undefined });
      expect(trackerMock.remove.calledWith(uuid)).to.be.true;
    });

    it('should match uuid from wrapper ids', function () {
      const baseVerifier = baseImpressionVerifier(trackerMock);
      const bid = { adId: 'a2', adUnitCode: 'u2' };
      const uuid = baseVerifier.trackBid(bid);
      const result = baseVerifier.getBidIdentifiers(null, null, [uuid]);
      expect(trackerMock.remove.calledWith(uuid)).to.be.true;
      expect(result).to.deep.equal({ adId: 'a2', adUnitCode: 'u2', requestId: undefined, auctionId: undefined });
    });
  });
});

/*
const adUnitCode = 'test_ad_unit_code';
const sampleBid = {
  adId: 'test_ad_id',
  adUnitCode,
  vastUrl: 'test_ad_url'
};
const sampleAdUnit = {
  code: adUnitCode,
};

const expectedImpressionUrl = 'test_impression_url';
const expectedImpressionId = 'test_impression_id';
const expectedErrorUrl = 'test_error_url';
const expectedVastXml = 'test_xml';

it('should not modify the bid\'s adXml when the tracking config is omitted', function () {
  const adUnit = Object.assign({}, sampleAdUnit, { video: { adServer: { tracking: null } } });
  const pbGlobal = Object.assign({}, pbGlobalMock, { adUnits: [ adUnit ] });
  pbVideoFactory(null, () => ({}), pbGlobal, pbEvents);

  bidAdjustmentCb(sampleBid);
  // expect(vastXmlEditorMock.getVastXmlWithTrackingNodes.called).to.be.false;
  // expect(vastXmlEditorMock.buildVastWrapper.called).to.be.false;
});

it('should request a vast wrapper when only an ad url is provided', function () {
  const adUnit = Object.assign({}, sampleAdUnit, { video: { adServer: { tracking: { } } } });
  const pbGlobal = Object.assign({}, pbGlobalMock, { adUnits: [ adUnit ] });
  pbVideoFactory(null, () => ({}), pbGlobal, pbEvents);

  bidAdjustmentCb(sampleBid);
  // expect(vastXmlEditorMock.getVastXmlWithTrackingNodes.called).to.be.false;
  // expect(vastXmlEditorMock.buildVastWrapper.called).to.be.true;
});

it('should request the addition of tracking nodes when an ad xml is provided', function () {
  const adUnit = Object.assign({}, sampleAdUnit, { video: { adServer: { tracking: { } } } });
  const pbGlobal = Object.assign({}, pbGlobalMock, { adUnits: [ adUnit ] });
  pbVideoFactory(null, () => ({}), pbGlobal, pbEvents);

  const bid = Object.assign({}, sampleBid, { vastXml: 'test_xml' });
  bidAdjustmentCb(bid);
  // expect(vastXmlEditorMock.getVastXmlWithTrackingNodes.called).to.be.true;
  // expect(vastXmlEditorMock.buildVastWrapper.called).to.be.false;
});

it('should pass the tracking information as args to the xml editing function', function () {
  const adUnit = Object.assign({}, sampleAdUnit, { video: { adServer: { tracking: {
    impression: {
      url: expectedImpressionUrl,
      id: expectedImpressionId
    },
    error: {
      url: expectedErrorUrl
    }
  } } } });
  const pbGlobal = Object.assign({}, pbGlobalMock, { adUnits: [ adUnit ] });
  pbVideoFactory(null, () => ({}), pbGlobal, pbEvents);

  const bid = Object.assign({}, sampleBid, { vastXml: expectedVastXml });
  bidAdjustmentCb(bid);
  // expect(vastXmlEditorMock.getVastXmlWithTrackingNodes.called).to.be.true;
  // expect(vastXmlEditorMock.getVastXmlWithTrackingNodes.calledWith(expectedVastXml, expectedImpressionUrl, expectedImpressionId, expectedErrorUrl))
  // expect(vastXmlEditorMock.buildVastWrapper.called).to.be.false;
});

it('should generate the impression id when not specified in config', function () {
  const adUnit = Object.assign({}, sampleAdUnit, { video: { adServer: { tracking: {
    impression: {
      url: expectedImpressionUrl,
    },
    error: {
      url: expectedErrorUrl
    }
  } } } });
  const pbGlobal = Object.assign({}, pbGlobalMock, { adUnits: [ adUnit ] });
  pbVideoFactory(null, () => ({}), pbGlobal, pbEvents);

  const bid = Object.assign({}, sampleBid, { vastXml: expectedVastXml });
  bidAdjustmentCb(bid);
  const expectedGeneratedId = sampleBid.adId + '-impression';
  // expect(vastXmlEditorMock.getVastXmlWithTrackingNodes.called).to.be.true;
  // expect(vastXmlEditorMock.getVastXmlWithTrackingNodes.calledWith(expectedVastXml, expectedImpressionUrl, expectedGeneratedId, expectedErrorUrl))
  // expect(vastXmlEditorMock.buildVastWrapper.called).to.be.false;
});
*/
