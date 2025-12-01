<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.0.0"
  xmlns="http://www.opengis.net/sld"
  xmlns:ogc="http://www.opengis.net/ogc"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd">

  <NamedLayer>
    <Name>lifesim:current_basic_living_zone</Name>
    <UserStyle>
      <Name>C_ts_ppop_23</Name>
      <Title>Current Basic Living Zone - C_ts_ppop_23 Classification</Title>
      <Abstract>5-class choropleth map based on C_ts_ppop_23 (persons)</Abstract>

      <FeatureTypeStyle>

        <!-- Class 1: 87 - 21456 -->
        <Rule>
          <Title>87 - 21456</Title>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsGreaterThanOrEqualTo>
                <ogc:PropertyName>C_ts_ppop_23</ogc:PropertyName>
                <ogc:Literal>87</ogc:Literal>
              </ogc:PropertyIsGreaterThanOrEqualTo>
              <ogc:PropertyIsLessThanOrEqualTo>
                <ogc:PropertyName>C_ts_ppop_23</ogc:PropertyName>
                <ogc:Literal>21456</ogc:Literal>
              </ogc:PropertyIsLessThanOrEqualTo>
            </ogc:And>
          </ogc:Filter>
          <PolygonSymbolizer>
            <Fill>
              <!-- very light cream -->
              <CssParameter name="fill">#f9f1e4</CssParameter>
              <CssParameter name="fill-opacity">0.85</CssParameter>
            </Fill>
            <Stroke>
              <CssParameter name="stroke">#8d6e63</CssParameter>
              <CssParameter name="stroke-width">1</CssParameter>
              <CssParameter name="stroke-opacity">0.6</CssParameter>
            </Stroke>
          </PolygonSymbolizer>
        </Rule>

        <!-- Class 2: 21456 - 42825 -->
        <Rule>
          <Title>21456 - 42825</Title>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsGreaterThan>
                <ogc:PropertyName>C_ts_ppop_23</ogc:PropertyName>
                <ogc:Literal>21456</ogc:Literal>
              </ogc:PropertyIsGreaterThan>
              <ogc:PropertyIsLessThanOrEqualTo>
                <ogc:PropertyName>C_ts_ppop_23</ogc:PropertyName>
                <ogc:Literal>42825</ogc:Literal>
              </ogc:PropertyIsLessThanOrEqualTo>
            </ogc:And>
          </ogc:Filter>
          <PolygonSymbolizer>
            <Fill>
              <!-- beige / soft tan -->
              <CssParameter name="fill">#f1cfa3</CssParameter>
              <CssParameter name="fill-opacity">0.85</CssParameter>
            </Fill>
            <Stroke>
              <CssParameter name="stroke">#8d6e63</CssParameter>
              <CssParameter name="stroke-width">1</CssParameter>
              <CssParameter name="stroke-opacity">0.6</CssParameter>
            </Stroke>
          </PolygonSymbolizer>
        </Rule>

        <!-- Class 3: 42825 - 64193 -->
        <Rule>
          <Title>42825 - 64193</Title>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsGreaterThan>
                <ogc:PropertyName>C_ts_ppop_23</ogc:PropertyName>
                <ogc:Literal>42825</ogc:Literal>
              </ogc:PropertyIsGreaterThan>
              <ogc:PropertyIsLessThanOrEqualTo>
                <ogc:PropertyName>C_ts_ppop_23</ogc:PropertyName>
                <ogc:Literal>64193</ogc:Literal>
              </ogc:PropertyIsLessThanOrEqualTo>
            </ogc:And>
          </ogc:Filter>
          <PolygonSymbolizer>
            <Fill>
              <!-- orange -->
              <CssParameter name="fill">#e68a3a</CssParameter>
              <CssParameter name="fill-opacity">0.85</CssParameter>
            </Fill>
            <Stroke>
              <CssParameter name="stroke">#6d4c41</CssParameter>
              <CssParameter name="stroke-width">1</CssParameter>
              <CssParameter name="stroke-opacity">0.6</CssParameter>
            </Stroke>
          </PolygonSymbolizer>
        </Rule>

        <!-- Class 4: 64193 - 85562 -->
        <Rule>
          <Title>64193 - 85562</Title>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsGreaterThan>
                <ogc:PropertyName>C_ts_ppop_23</ogc:PropertyName>
                <ogc:Literal>64193</ogc:Literal>
              </ogc:PropertyIsGreaterThan>
              <ogc:PropertyIsLessThanOrEqualTo>
                <ogc:PropertyName>C_ts_ppop_23</ogc:PropertyName>
                <ogc:Literal>85562</ogc:Literal>
              </ogc:PropertyIsLessThanOrEqualTo>
            </ogc:And>
          </ogc:Filter>
          <PolygonSymbolizer>
            <Fill>
              <!-- deep orange -->
              <CssParameter name="fill">#c85a17</CssParameter>
              <CssParameter name="fill-opacity">0.85</CssParameter>
            </Fill>
            <Stroke>
              <CssParameter name="stroke">#5d4037</CssParameter>
              <CssParameter name="stroke-width">1</CssParameter>
              <CssParameter name="stroke-opacity">0.6</CssParameter>
            </Stroke>
          </PolygonSymbolizer>
        </Rule>

        <!-- Class 5: 85562 - 106931 -->
        <Rule>
          <Title>85562 - 106931</Title>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsGreaterThan>
                <ogc:PropertyName>C_ts_ppop_23</ogc:PropertyName>
                <ogc:Literal>85562</ogc:Literal>
              </ogc:PropertyIsGreaterThan>
              <ogc:PropertyIsLessThanOrEqualTo>
                <ogc:PropertyName>C_ts_ppop_23</ogc:PropertyName>
                <ogc:Literal>106931</ogc:Literal>
              </ogc:PropertyIsLessThanOrEqualTo>
            </ogc:And>
          </ogc:Filter>
          <PolygonSymbolizer>
            <Fill>
              <!-- strong brown -->
              <CssParameter name="fill">#8b3e02</CssParameter>
              <CssParameter name="fill-opacity">0.85</CssParameter>
            </Fill>
            <Stroke>
              <CssParameter name="stroke">#4e342e</CssParameter>
              <CssParameter name="stroke-width">1</CssParameter>
              <CssParameter name="stroke-opacity">0.6</CssParameter>
            </Stroke>
          </PolygonSymbolizer>
        </Rule>

        <!-- No Data / out of range -->
        <Rule>
          <Title>No Data</Title>
          <ogc:Filter>
            <ogc:Or>
              <ogc:PropertyIsNull>
                <ogc:PropertyName>C_ts_ppop_23</ogc:PropertyName>
              </ogc:PropertyIsNull>
              <ogc:PropertyIsLessThan>
                <ogc:PropertyName>C_ts_ppop_23</ogc:PropertyName>
                <ogc:Literal>87</ogc:Literal>
              </ogc:PropertyIsLessThan>
              <ogc:PropertyIsGreaterThan>
                <ogc:PropertyName>C_ts_ppop_23</ogc:PropertyName>
                <ogc:Literal>106931</ogc:Literal>
              </ogc:PropertyIsGreaterThan>
            </ogc:Or>
          </ogc:Filter>
          <PolygonSymbolizer>
            <Fill>
              <CssParameter name="fill">#e0e0e0</CssParameter>
              <CssParameter name="fill-opacity">0.45</CssParameter>
            </Fill>
            <Stroke>
              <CssParameter name="stroke">#9e9e9e</CssParameter>
              <CssParameter name="stroke-width">1</CssParameter>
              <CssParameter name="stroke-opacity">0.5</CssParameter>
              <CssParameter name="stroke-dasharray">4 4</CssParameter>
            </Stroke>
          </PolygonSymbolizer>
        </Rule>

      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
