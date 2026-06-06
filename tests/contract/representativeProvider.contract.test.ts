import { RepresentativeProvider } from "../../src/providers/representativeProvider";
import { FixtureProvider } from "../../src/providers/fixtures/fixtureProvider";
import { goldenAddresses } from "../../src/providers/fixtures/goldenAddresses";

describe('RepresentativeProvider contract (fixture)', () => {
  const provider: RepresentativeProvider = new FixtureProvider();

  it('should return a supported lookup result for a known address', async () => {
    const address = goldenAddresses[0];
    const result = await provider.lookup(address);

    expect(result.status).toBe('supported');
    expect(result.confidence).toBe('high');
    expect(result.districts.length).toBeGreaterThan(0);
    expect(result.representatives.length).toBeGreaterThan(0);
  });
});
