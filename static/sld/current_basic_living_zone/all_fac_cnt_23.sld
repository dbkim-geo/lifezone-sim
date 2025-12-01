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
      <Name>all_fac_cnt_23</Name>
      <Title>Current Basic Living Zone - all_fac_cnt_23 Classification</Title>
      <Abstract>5-class choropleth map based on all_fac_cnt_23 (count)</Abstract>

      <FeatureTypeStyle>

        <!-- Class 1: 3 - 96 -->
        <Rule>
          <Title>3 - 96</Title>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsGreaterThanOrEqualTo>
                <ogc:PropertyName>all_fac_cnt_23</ogc:PropertyName>
                <ogc:Literal>3</ogc:Literal>
              </ogc:PropertyIsGreaterThanOrEqualTo>
              <ogc:PropertyIsLessThanOrEqualTo>
                <ogc:PropertyName>all_fac_cnt_23</ogc:PropertyName>
                <ogc:Literal>96</ogc:Literal>
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

        <!-- Class 2: 96 - 189 -->
        <Rule>
          <Title>96 - 189</Title>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsGreaterThan>
                <ogc:PropertyName>all_fac_cnt_23</ogc:PropertyName>
                <ogc:Literal>96</ogc:Literal>
              </ogc:PropertyIsGreaterThan>
              <ogc:PropertyIsLessThanOrEqualTo>
                <ogc:PropertyName>all_fac_cnt_23</ogc:PropertyName>
                <ogc:Literal>189</ogc:Literal>
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

        <!-- Class 3: 189 - 283 -->
        <Rule>
          <Title>189 - 283</Title>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsGreaterThan>
                <ogc:PropertyName>all_fac_cnt_23</ogc:PropertyName>
                <ogc:Literal>189</ogc:Literal>
              </ogc:PropertyIsGreaterThan>
              <ogc:PropertyIsLessThanOrEqualTo>
                <ogc:PropertyName>all_fac_cnt_23</ogc:PropertyName>
                <ogc:Literal>283</ogc:Literal>
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

        <!-- Class 4: 283 - 376 -->
        <Rule>
          <Title>283 - 376</Title>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsGreaterThan>
                <ogc:PropertyName>all_fac_cnt_23</ogc:PropertyName>
                <ogc:Literal>283</ogc:Literal>
              </ogc:PropertyIsGreaterThan>
              <ogc:PropertyIsLessThanOrEqualTo>
                <ogc:PropertyName>all_fac_cnt_23</ogc:PropertyName>
                <ogc:Literal>376</ogc:Literal>
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

        <!-- Class 5: 376 - 469 -->
        <Rule>
          <Title>376 - 469</Title>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsGreaterThan>
                <ogc:PropertyName>all_fac_cnt_23</ogc:PropertyName>
                <ogc:Literal>376</ogc:Literal>
              </ogc:PropertyIsGreaterThan>
              <ogc:PropertyIsLessThanOrEqualTo>
                <ogc:PropertyName>all_fac_cnt_23</ogc:PropertyName>
                <ogc:Literal>469</ogc:Literal>
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
                <ogc:PropertyName>all_fac_cnt_23</ogc:PropertyName>
              </ogc:PropertyIsNull>
              <ogc:PropertyIsLessThan>
                <ogc:PropertyName>all_fac_cnt_23</ogc:PropertyName>
                <ogc:Literal>3</ogc:Literal>
              </ogc:PropertyIsLessThan>
              <ogc:PropertyIsGreaterThan>
                <ogc:PropertyName>all_fac_cnt_23</ogc:PropertyName>
                <ogc:Literal>469</ogc:Literal>
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
