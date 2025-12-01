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
      <Name>ele_schools_cnt_23</Name>
      <Title>Current Basic Living Zone - ele_schools_cnt_23 Classification</Title>
      <Abstract>5-class choropleth map based on ele_schools_cnt_23 (count)</Abstract>

      <FeatureTypeStyle>

        <!-- Class 1: 1 - 3.6 -->
        <Rule>
          <Title>1 - 3.6</Title>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsGreaterThanOrEqualTo>
                <ogc:PropertyName>ele_schools_cnt_23</ogc:PropertyName>
                <ogc:Literal>1</ogc:Literal>
              </ogc:PropertyIsGreaterThanOrEqualTo>
              <ogc:PropertyIsLessThanOrEqualTo>
                <ogc:PropertyName>ele_schools_cnt_23</ogc:PropertyName>
                <ogc:Literal>3.6</ogc:Literal>
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

        <!-- Class 2: 3.6 - 6.2 -->
        <Rule>
          <Title>3.6 - 6.2</Title>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsGreaterThan>
                <ogc:PropertyName>ele_schools_cnt_23</ogc:PropertyName>
                <ogc:Literal>3.6</ogc:Literal>
              </ogc:PropertyIsGreaterThan>
              <ogc:PropertyIsLessThanOrEqualTo>
                <ogc:PropertyName>ele_schools_cnt_23</ogc:PropertyName>
                <ogc:Literal>6.2</ogc:Literal>
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

        <!-- Class 3: 6.2 - 8.8 -->
        <Rule>
          <Title>6.2 - 8.8</Title>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsGreaterThan>
                <ogc:PropertyName>ele_schools_cnt_23</ogc:PropertyName>
                <ogc:Literal>6.2</ogc:Literal>
              </ogc:PropertyIsGreaterThan>
              <ogc:PropertyIsLessThanOrEqualTo>
                <ogc:PropertyName>ele_schools_cnt_23</ogc:PropertyName>
                <ogc:Literal>8.8</ogc:Literal>
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

        <!-- Class 4: 8.8 - 11.4 -->
        <Rule>
          <Title>8.8 - 11.4</Title>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsGreaterThan>
                <ogc:PropertyName>ele_schools_cnt_23</ogc:PropertyName>
                <ogc:Literal>8.8</ogc:Literal>
              </ogc:PropertyIsGreaterThan>
              <ogc:PropertyIsLessThanOrEqualTo>
                <ogc:PropertyName>ele_schools_cnt_23</ogc:PropertyName>
                <ogc:Literal>11.4</ogc:Literal>
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

        <!-- Class 5: 11.4 - 14 -->
        <Rule>
          <Title>11.4 - 14</Title>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsGreaterThan>
                <ogc:PropertyName>ele_schools_cnt_23</ogc:PropertyName>
                <ogc:Literal>11.4</ogc:Literal>
              </ogc:PropertyIsGreaterThan>
              <ogc:PropertyIsLessThanOrEqualTo>
                <ogc:PropertyName>ele_schools_cnt_23</ogc:PropertyName>
                <ogc:Literal>14</ogc:Literal>
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
                <ogc:PropertyName>ele_schools_cnt_23</ogc:PropertyName>
              </ogc:PropertyIsNull>
              <ogc:PropertyIsLessThan>
                <ogc:PropertyName>ele_schools_cnt_23</ogc:PropertyName>
                <ogc:Literal>1</ogc:Literal>
              </ogc:PropertyIsLessThan>
              <ogc:PropertyIsGreaterThan>
                <ogc:PropertyName>ele_schools_cnt_23</ogc:PropertyName>
                <ogc:Literal>14</ogc:Literal>
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
