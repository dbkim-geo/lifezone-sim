<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.0.0"
  xmlns="http://www.opengis.net/sld"
  xmlns:ogc="http://www.opengis.net/ogc"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd">

  <NamedLayer>
    <Name>lifesim:current_basic_living_zone</Name>

    <UserStyle>
      <Name>ts_pop_den_23</Name>
      <Title>ts_pop_den_23</Title>

      <FeatureTypeStyle>

        <!-- 19 - 41 -->
        <Rule>
          <Title>19 - 41</Title>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsGreaterThanOrEqualTo>
                <ogc:PropertyName>ts_pop_den_23</ogc:PropertyName>
                <ogc:Literal>19</ogc:Literal>
              </ogc:PropertyIsGreaterThanOrEqualTo>
              <ogc:PropertyIsLessThanOrEqualTo>
                <ogc:PropertyName>ts_pop_den_23</ogc:PropertyName>
                <ogc:Literal>41</ogc:Literal>
              </ogc:PropertyIsLessThanOrEqualTo>
            </ogc:And>
          </ogc:Filter>

          <PolygonSymbolizer>
            <Fill>
              <CssParameter name="fill">#fff7e6</CssParameter>
              <CssParameter name="fill-opacity">0.90</CssParameter>
            </Fill>
            <Stroke>
              <CssParameter name="stroke">#8c6d31</CssParameter>
              <CssParameter name="stroke-width">0.7</CssParameter>
            </Stroke>
          </PolygonSymbolizer>
        </Rule>

        <!-- 41 - 63 -->
        <Rule>
          <Title>41 - 63</Title>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsGreaterThan>
                <ogc:PropertyName>ts_pop_den_23</ogc:PropertyName>
                <ogc:Literal>41</ogc:Literal>
              </ogc:PropertyIsGreaterThan>
              <ogc:PropertyIsLessThanOrEqualTo>
                <ogc:PropertyName>ts_pop_den_23</ogc:PropertyName>
                <ogc:Literal>63</ogc:Literal>
              </ogc:PropertyIsLessThanOrEqualTo>
            </ogc:And>
          </ogc:Filter>

          <PolygonSymbolizer>
            <Fill>
              <CssParameter name="fill">#fee6c8</CssParameter>
              <CssParameter name="fill-opacity">0.90</CssParameter>
            </Fill>
            <Stroke>
              <CssParameter name="stroke">#8c6d31</CssParameter>
              <CssParameter name="stroke-width">0.7</CssParameter>
            </Stroke>
          </PolygonSymbolizer>
        </Rule>

        <!-- 63 - 85 -->
        <Rule>
          <Title>63 - 85</Title>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsGreaterThan>
                <ogc:PropertyName>ts_pop_den_23</ogc:PropertyName>
                <ogc:Literal>63</ogc:Literal>
              </ogc:PropertyIsGreaterThan>
              <ogc:PropertyIsLessThanOrEqualTo>
                <ogc:PropertyName>ts_pop_den_23</ogc:PropertyName>
                <ogc:Literal>85</ogc:Literal>
              </ogc:PropertyIsLessThanOrEqualTo>
            </ogc:And>
          </ogc:Filter>

          <PolygonSymbolizer>
            <Fill>
              <CssParameter name="fill">#fdae6b</CssParameter>
              <CssParameter name="fill-opacity">0.90</CssParameter>
            </Fill>
            <Stroke>
              <CssParameter name="stroke">#8c6d31</CssParameter>
              <CssParameter name="stroke-width">0.7</CssParameter>
            </Stroke>
          </PolygonSymbolizer>
        </Rule>

        <!-- 85 - 107 -->
        <Rule>
          <Title>85 - 107</Title>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsGreaterThan>
                <ogc:PropertyName>ts_pop_den_23</ogc:PropertyName>
                <ogc:Literal>85</ogc:Literal>
              </ogc:PropertyIsGreaterThan>
              <ogc:PropertyIsLessThanOrEqualTo>
                <ogc:PropertyName>ts_pop_den_23</ogc:PropertyName>
                <ogc:Literal>107</ogc:Literal>
              </ogc:PropertyIsLessThanOrEqualTo>
            </ogc:And>
          </ogc:Filter>

          <PolygonSymbolizer>
            <Fill>
              <CssParameter name="fill">#e6550d</CssParameter>
              <CssParameter name="fill-opacity">0.90</CssParameter>
            </Fill>
            <Stroke>
              <CssParameter name="stroke">#8c6d31</CssParameter>
              <CssParameter name="stroke-width">0.7</CssParameter>
            </Stroke>
          </PolygonSymbolizer>
        </Rule>

        <!-- 107 - 129 -->
        <Rule>
          <Title>107 - 129</Title>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsGreaterThan>
                <ogc:PropertyName>ts_pop_den_23</ogc:PropertyName>
                <ogc:Literal>107</ogc:Literal>
              </ogc:PropertyIsGreaterThan>
              <ogc:PropertyIsLessThanOrEqualTo>
                <ogc:PropertyName>ts_pop_den_23</ogc:PropertyName>
                <ogc:Literal>129</ogc:Literal>
              </ogc:PropertyIsLessThanOrEqualTo>
            </ogc:And>
          </ogc:Filter>

          <PolygonSymbolizer>
            <Fill>
              <CssParameter name="fill">#a63603</CssParameter>
              <CssParameter name="fill-opacity">0.90</CssParameter>
            </Fill>
            <Stroke>
              <CssParameter name="stroke">#8c6d31</CssParameter>
              <CssParameter name="stroke-width">0.7</CssParameter>
            </Stroke>
          </PolygonSymbolizer>
        </Rule>

      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
