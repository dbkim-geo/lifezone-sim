<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.0.0"
  xmlns="http://www.opengis.net/sld"
  xmlns:ogc="http://www.opengis.net/ogc"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd">

  <NamedLayer>
    <Name>lifesim:current_basic_living_zone</Name>

    <UserStyle>
      <Name>c_pop_ratio_23</Name>
      <Title>c_pop_ratio_23 (%)</Title>
      <Abstract>5-class blue scale for c_pop_ratio_23</Abstract>

      <FeatureTypeStyle>

        <!-- 25 - 36 -->
        <Rule>
          <Title>25 - 36</Title>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsGreaterThanOrEqualTo>
                <ogc:PropertyName>c_pop_ratio_23</ogc:PropertyName>
                <ogc:Literal>25</ogc:Literal>
              </ogc:PropertyIsGreaterThanOrEqualTo>
              <ogc:PropertyIsLessThanOrEqualTo>
                <ogc:PropertyName>c_pop_ratio_23</ogc:PropertyName>
                <ogc:Literal>36</ogc:Literal>
              </ogc:PropertyIsLessThanOrEqualTo>
            </ogc:And>
          </ogc:Filter>
          <PolygonSymbolizer>
            <Fill>
              <!-- very light blue -->
              <CssParameter name="fill">#e8f0fa</CssParameter>
              <CssParameter name="fill-opacity">0.9</CssParameter>
            </Fill>
            <Stroke>
              <CssParameter name="stroke">#35516a</CssParameter>
              <CssParameter name="stroke-width">0.8</CssParameter>
            </Stroke>
          </PolygonSymbolizer>
        </Rule>

        <!-- 36 - 47 -->
        <Rule>
          <Title>36 - 47</Title>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsGreaterThan>
                <ogc:PropertyName>c_pop_ratio_23</ogc:PropertyName>
                <ogc:Literal>36</ogc:Literal>
              </ogc:PropertyIsGreaterThan>
              <ogc:PropertyIsLessThanOrEqualTo>
                <ogc:PropertyName>c_pop_ratio_23</ogc:PropertyName>
                <ogc:Literal>47</ogc:Literal>
              </ogc:PropertyIsLessThanOrEqualTo>
            </ogc:And>
          </ogc:Filter>
          <PolygonSymbolizer>
            <Fill>
              <!-- soft blue -->
              <CssParameter name="fill">#bfd5ec</CssParameter>
              <CssParameter name="fill-opacity">0.9</CssParameter>
            </Fill>
            <Stroke>
              <CssParameter name="stroke">#35516a</CssParameter>
              <CssParameter name="stroke-width">0.8</CssParameter>
            </Stroke>
          </PolygonSymbolizer>
        </Rule>

        <!-- 47 - 58 -->
        <Rule>
          <Title>47 - 58</Title>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsGreaterThan>
                <ogc:PropertyName>c_pop_ratio_23</ogc:PropertyName>
                <ogc:Literal>47</ogc:Literal>
              </ogc:PropertyIsGreaterThan>
              <ogc:PropertyIsLessThanOrEqualTo>
                <ogc:PropertyName>c_pop_ratio_23</ogc:PropertyName>
                <ogc:Literal>58</ogc:Literal>
              </ogc:PropertyIsLessThanOrEqualTo>
            </ogc:And>
          </ogc:Filter>
          <PolygonSymbolizer>
            <Fill>
              <!-- mid blue -->
              <CssParameter name="fill">#7fb2d6</CssParameter>
              <CssParameter name="fill-opacity">0.9</CssParameter>
            </Fill>
            <Stroke>
              <CssParameter name="stroke">#2e4a63</CssParameter>
              <CssParameter name="stroke-width">0.8</CssParameter>
            </Stroke>
          </PolygonSymbolizer>
        </Rule>

        <!-- 58 - 68 -->
        <Rule>
          <Title>58 - 68</Title>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsGreaterThan>
                <ogc:PropertyName>c_pop_ratio_23</ogc:PropertyName>
                <ogc:Literal>58</ogc:Literal>
              </ogc:PropertyIsGreaterThan>
              <ogc:PropertyIsLessThanOrEqualTo>
                <ogc:PropertyName>c_pop_ratio_23</ogc:PropertyName>
                <ogc:Literal>68</ogc:Literal>
              </ogc:PropertyIsLessThanOrEqualTo>
            </ogc:And>
          </ogc:Filter>
          <PolygonSymbolizer>
            <Fill>
              <!-- strong blue -->
              <CssParameter name="fill">#2b72b2</CssParameter>
              <CssParameter name="fill-opacity">0.9</CssParameter>
            </Fill>
            <Stroke>
              <CssParameter name="stroke">#1f3f63</CssParameter>
              <CssParameter name="stroke-width">0.8</CssParameter>
            </Stroke>
          </PolygonSymbolizer>
        </Rule>

        <!-- 68 - 80 -->
        <Rule>
          <Title>68 - 80</Title>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsGreaterThan>
                <ogc:PropertyName>c_pop_ratio_23</ogc:PropertyName>
                <ogc:Literal>68</ogc:Literal>
              </ogc:PropertyIsGreaterThan>
              <ogc:PropertyIsLessThanOrEqualTo>
                <ogc:PropertyName>c_pop_ratio_23</ogc:PropertyName>
                <ogc:Literal>80</ogc:Literal>
              </ogc:PropertyIsLessThanOrEqualTo>
            </ogc:And>
          </ogc:Filter>
          <PolygonSymbolizer>
            <Fill>
              <!-- deep navy -->
              <CssParameter name="fill">#08306b</CssParameter>
              <CssParameter name="fill-opacity">0.9</CssParameter>
            </Fill>
            <Stroke>
              <CssParameter name="stroke">#0a2346</CssParameter>
              <CssParameter name="stroke-width">0.8</CssParameter>
            </Stroke>
          </PolygonSymbolizer>
        </Rule>

        <!-- No data -->
        <Rule>
          <Title>No Data</Title>
          <ogc:Filter>
            <ogc:Or>
              <ogc:PropertyIsNull>
                <ogc:PropertyName>c_pop_ratio_23</ogc:PropertyName>
              </ogc:PropertyIsNull>
            </ogc:Or>
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
