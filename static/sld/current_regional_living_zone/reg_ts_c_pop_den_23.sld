<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.0.0"
  xmlns="http://www.opengis.net/sld"
  xmlns:ogc="http://www.opengis.net/ogc"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd">

  <NamedLayer>
    <Name>lifesim:current_basic_living_zone</Name>

    <UserStyle>
      <Name>ts_c_pop_den_23</Name>
      <Title>ts_c_pop_den_23 (persons per km2)</Title>

      <FeatureTypeStyle>

        <!-- 681 - 1624 -->
        <Rule>
          <Title>681 - 1624</Title>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsGreaterThanOrEqualTo>
                <ogc:PropertyName>ts_c_pop_den_23</ogc:PropertyName>
                <ogc:Literal>681</ogc:Literal>
              </ogc:PropertyIsGreaterThanOrEqualTo>
              <ogc:PropertyIsLessThanOrEqualTo>
                <ogc:PropertyName>ts_c_pop_den_23</ogc:PropertyName>
                <ogc:Literal>1624</ogc:Literal>
              </ogc:PropertyIsLessThanOrEqualTo>
            </ogc:And>
          </ogc:Filter>
          <PolygonSymbolizer>
            <!-- very light beige -->
            <Fill>
              <CssParameter name="fill">#fff7e6</CssParameter>
              <CssParameter name="fill-opacity">0.9</CssParameter>
            </Fill>
            <Stroke>
              <CssParameter name="stroke">#8c6d31</CssParameter>
              <CssParameter name="stroke-width">0.7</CssParameter>
            </Stroke>
          </PolygonSymbolizer>
        </Rule>

        <!-- 1624 - 2568 -->
        <Rule>
          <Title>1624 - 2568</Title>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsGreaterThan>
                <ogc:PropertyName>ts_c_pop_den_23</ogc:PropertyName>
                <ogc:Literal>1624</ogc:Literal>
              </ogc:PropertyIsGreaterThan>
              <ogc:PropertyIsLessThanOrEqualTo>
                <ogc:PropertyName>ts_c_pop_den_23</ogc:PropertyName>
                <ogc:Literal>2568</ogc:Literal>
              </ogc:PropertyIsLessThanOrEqualTo>
            </ogc:And>
          </ogc:Filter>
          <PolygonSymbolizer>
            <!-- light peach -->
            <Fill>
              <CssParameter name="fill">#fdd9aa</CssParameter>
              <CssParameter name="fill-opacity">0.9</CssParameter>
            </Fill>
            <Stroke>
              <CssParameter name="stroke">#8c6d31</CssParameter>
              <CssParameter name="stroke-width">0.7</CssParameter>
            </Stroke>
          </PolygonSymbolizer>
        </Rule>

        <!-- 2567 - 3511 -->
        <Rule>
          <Title>2567 - 3511</Title>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsGreaterThan>
                <ogc:PropertyName>ts_c_pop_den_23</ogc:PropertyName>
                <ogc:Literal>2567</ogc:Literal>
              </ogc:PropertyIsGreaterThan>
              <ogc:PropertyIsLessThanOrEqualTo>
                <ogc:PropertyName>ts_c_pop_den_23</ogc:PropertyName>
                <ogc:Literal>3511</ogc:Literal>
              </ogc:PropertyIsLessThanOrEqualTo>
            </ogc:And>
          </ogc:Filter>
          <PolygonSymbolizer>
            <!-- medium orange -->
            <Fill>
              <CssParameter name="fill">#fca85b</CssParameter>
              <CssParameter name="fill-opacity">0.9</CssParameter>
            </Fill>
            <Stroke>
              <CssParameter name="stroke">#8c6d31</CssParameter>
              <CssParameter name="stroke-width">0.7</CssParameter>
            </Stroke>
          </PolygonSymbolizer>
        </Rule>

        <!-- 3511 - 4455 -->
        <Rule>
          <Title>3511 - 4455</Title>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsGreaterThan>
                <ogc:PropertyName>ts_c_pop_den_23</ogc:PropertyName>
                <ogc:Literal>3511</ogc:Literal>
              </ogc:PropertyIsGreaterThan>
              <ogc:PropertyIsLessThanOrEqualTo>
                <ogc:PropertyName>ts_c_pop_den_23</ogc:PropertyName>
                <ogc:Literal>4455</ogc:Literal>
              </ogc:PropertyIsLessThanOrEqualTo>
            </ogc:And>
          </ogc:Filter>
          <PolygonSymbolizer>
            <!-- strong orange -->
            <Fill>
              <CssParameter name="fill">#e45a11</CssParameter>
              <CssParameter name="fill-opacity">0.9</CssParameter>
            </Fill>
            <Stroke>
              <CssParameter name="stroke">#8c3b0a</CssParameter>
              <CssParameter name="stroke-width">0.7</CssParameter>
            </Stroke>
          </PolygonSymbolizer>
        </Rule>

        <!-- 4455 - 5400 -->
        <Rule>
          <Title>4455 - 5400</Title>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsGreaterThan>
                <ogc:PropertyName>ts_c_pop_den_23</ogc:PropertyName>
                <ogc:Literal>4455</ogc:Literal>
              </ogc:PropertyIsGreaterThan>
              <ogc:PropertyIsLessThanOrEqualTo>
                <ogc:PropertyName>ts_c_pop_den_23</ogc:PropertyName>
                <ogc:Literal>5400</ogc:Literal>
              </ogc:PropertyIsLessThanOrEqualTo>
            </ogc:And>
          </ogc:Filter>
          <PolygonSymbolizer>
            <!-- dark brown-orange -->
            <Fill>
              <CssParameter name="fill">#a04912</CssParameter>
              <CssParameter name="fill-opacity">0.9</CssParameter>
            </Fill>
            <Stroke>
              <CssParameter name="stroke">#6b2e09</CssParameter>
              <CssParameter name="stroke-width">0.7</CssParameter>
            </Stroke>
          </PolygonSymbolizer>
        </Rule>

        <!-- No Data -->
        <Rule>
          <Title>No Data</Title>
          <ogc:Filter>
            <ogc:PropertyIsNull>
              <ogc:PropertyName>ts_c_pop_den_23</ogc:PropertyName>
            </ogc:PropertyIsNull>
          </ogc:Filter>
          <PolygonSymbolizer>
            <Fill>
              <CssParameter name="fill">#d9d9d9</CssParameter>
              <CssParameter name="fill-opacity">0.4</CssParameter>
            </Fill>
            <Stroke>
              <CssParameter name="stroke">#9c9c9c</CssParameter>
              <CssParameter name="stroke-width">0.7</CssParameter>
              <CssParameter name="stroke-dasharray">4 3</CssParameter>
            </Stroke>
          </PolygonSymbolizer>
        </Rule>

      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
