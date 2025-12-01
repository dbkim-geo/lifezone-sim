<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.0.0"
  xmlns="http://www.opengis.net/sld"
  xmlns:ogc="http://www.opengis.net/ogc"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd">

  <NamedLayer>
    <Name>lifesim:current_basic_living_zone</Name>

    <UserStyle>
      <Name>ts_pop_23</Name>
      <Title>ts_pop_23</Title>

      <FeatureTypeStyle>

        <!-- 14973 - 40535 -->
        <Rule>
          <Title>14973 - 40535</Title>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsGreaterThanOrEqualTo>
                <ogc:PropertyName>ts_pop_23</ogc:PropertyName>
                <ogc:Literal>14973</ogc:Literal>
              </ogc:PropertyIsGreaterThanOrEqualTo>
              <ogc:PropertyIsLessThanOrEqualTo>
                <ogc:PropertyName>ts_pop_23</ogc:PropertyName>
                <ogc:Literal>40535</ogc:Literal>
              </ogc:PropertyIsLessThanOrEqualTo>
            </ogc:And>
          </ogc:Filter>

          <PolygonSymbolizer>
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

        <!-- 40535 - 66097 -->
        <Rule>
          <Title>40535 - 66097</Title>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsGreaterThan>
                <ogc:PropertyName>ts_pop_23</ogc:PropertyName>
                <ogc:Literal>40535</ogc:Literal>
              </ogc:PropertyIsGreaterThan>
              <ogc:PropertyIsLessThanOrEqualTo>
                <ogc:PropertyName>ts_pop_23</ogc:PropertyName>
                <ogc:Literal>66097</ogc:Literal>
              </ogc:PropertyIsLessThanOrEqualTo>
            </ogc:And>
          </ogc:Filter>

          <PolygonSymbolizer>
            <Fill>
              <CssParameter name="fill">#fee6c8</CssParameter>
              <CssParameter name="fill-opacity">0.9</CssParameter>
            </Fill>
            <Stroke>
              <CssParameter name="stroke">#8c6d31</CssParameter>
              <CssParameter name="stroke-width">0.7</CssParameter>
            </Stroke>
          </PolygonSymbolizer>
        </Rule>

        <!-- 66097 - 91660 -->
        <Rule>
          <Title>66097 - 91660</Title>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsGreaterThan>
                <ogc:PropertyName>ts_pop_23</ogc:PropertyName>
                <ogc:Literal>66097</ogc:Literal>
              </ogc:PropertyIsGreaterThan>
              <ogc:PropertyIsLessThanOrEqualTo>
                <ogc:PropertyName>ts_pop_23</ogc:PropertyName>
                <ogc:Literal>91660</ogc:Literal>
              </ogc:PropertyIsLessThanOrEqualTo>
            </ogc:And>
          </ogc:Filter>

          <PolygonSymbolizer>
            <Fill>
              <CssParameter name="fill">#fdae6b</CssParameter>
              <CssParameter name="fill-opacity">0.9</CssParameter>
            </Fill>
            <Stroke>
              <CssParameter name="stroke">#8c6d31</CssParameter>
              <CssParameter name="stroke-width">0.7</CssParameter>
            </Stroke>
          </PolygonSymbolizer>
        </Rule>

        <!-- 91660 - 117222 -->
        <Rule>
          <Title>91660 - 117222</Title>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsGreaterThan>
                <ogc:PropertyName>ts_pop_23</ogc:PropertyName>
                <ogc:Literal>91660</ogc:Literal>
              </ogc:PropertyIsGreaterThan>
              <ogc:PropertyIsLessThanOrEqualTo>
                <ogc:PropertyName>ts_pop_23</ogc:PropertyName>
                <ogc:Literal>117222</ogc:Literal>
              </ogc:PropertyIsLessThanOrEqualTo>
            </ogc:And>
          </ogc:Filter>

          <PolygonSymbolizer>
            <Fill>
              <CssParameter name="fill">#e6550d</CssParameter>
              <CssParameter name="fill-opacity">0.9</CssParameter>
            </Fill>
            <Stroke>
              <CssParameter name="stroke">#8c6d31</CssParameter>
              <CssParameter name="stroke-width">0.7</CssParameter>
            </Stroke>
          </PolygonSymbolizer>
        </Rule>

        <!-- 117222 - 142784 -->
        <Rule>
          <Title>117222 - 142784</Title>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsGreaterThan>
                <ogc:PropertyName>ts_pop_23</ogc:PropertyName>
                <ogc:Literal>117222</ogc:Literal>
              </ogc:PropertyIsGreaterThan>
              <ogc:PropertyIsLessThanOrEqualTo>
                <ogc:PropertyName>ts_pop_23</ogc:PropertyName>
                <ogc:Literal>142784</ogc:Literal>
              </ogc:PropertyIsLessThanOrEqualTo>
            </ogc:And>
          </ogc:Filter>

          <PolygonSymbolizer>
            <Fill>
              <CssParameter name="fill">#a63603</CssParameter>
              <CssParameter name="fill-opacity">0.9</CssParameter>
            </Fill>
            <Stroke>
              <CssParameter name="stroke">#8c6d31</CssParameter>
              <CssParameter name="stroke-width">0.7</CssParameter>
            </Stroke>
          </PolygonSymbolizer>
        </Rule>

        <!-- No Data -->
        <Rule>
          <Title>No Data</Title>
          <ogc:Filter>
            <ogc:PropertyIsNull>
              <ogc:PropertyName>ts_pop_23</ogc:PropertyName>
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
