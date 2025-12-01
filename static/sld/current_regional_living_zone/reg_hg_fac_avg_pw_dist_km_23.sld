<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.0.0"
  xmlns="http://www.opengis.net/sld"
  xmlns:ogc="http://www.opengis.net/ogc"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd">

  <NamedLayer>
    <Name>lifesim:current_basic_living_zone</Name>

    <UserStyle>
      <Name>hg_fac_avg_pw_dist_km_23</Name>
      <Title>hg_fac_avg_pw_dist_km_23 (km)</Title>
      <Abstract>5-class blue scale for hg_fac_avg_pw_dist_km_23</Abstract>

      <FeatureTypeStyle>

        <!-- 5.5 - 8.9 -->
        <Rule>
          <Title>5.5 - 8.9</Title>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsGreaterThanOrEqualTo>
                <ogc:PropertyName>hg_fac_avg_pw_dist_km_23</ogc:PropertyName>
                <ogc:Literal>5.5</ogc:Literal>
              </ogc:PropertyIsGreaterThanOrEqualTo>
              <ogc:PropertyIsLessThanOrEqualTo>
                <ogc:PropertyName>hg_fac_avg_pw_dist_km_23</ogc:PropertyName>
                <ogc:Literal>8.9</ogc:Literal>
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

        <!-- 8.9 - 12.4 -->
        <Rule>
          <Title>8.9 - 12.4</Title>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsGreaterThan>
                <ogc:PropertyName>hg_fac_avg_pw_dist_km_23</ogc:PropertyName>
                <ogc:Literal>8.9</ogc:Literal>
              </ogc:PropertyIsGreaterThan>
              <ogc:PropertyIsLessThanOrEqualTo>
                <ogc:PropertyName>hg_fac_avg_pw_dist_km_23</ogc:PropertyName>
                <ogc:Literal>12.4</ogc:Literal>
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

        <!-- 12.4 - 15.8 -->
        <Rule>
          <Title>12.4 - 15.8</Title>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsGreaterThan>
                <ogc:PropertyName>hg_fac_avg_pw_dist_km_23</ogc:PropertyName>
                <ogc:Literal>12.4</ogc:Literal>
              </ogc:PropertyIsGreaterThan>
              <ogc:PropertyIsLessThanOrEqualTo>
                <ogc:PropertyName>hg_fac_avg_pw_dist_km_23</ogc:PropertyName>
                <ogc:Literal>15.8</ogc:Literal>
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

        <!-- 15.8 - 19.3 -->
        <Rule>
          <Title>15.8 - 19.3</Title>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsGreaterThan>
                <ogc:PropertyName>hg_fac_avg_pw_dist_km_23</ogc:PropertyName>
                <ogc:Literal>15.8</ogc:Literal>
              </ogc:PropertyIsGreaterThan>
              <ogc:PropertyIsLessThanOrEqualTo>
                <ogc:PropertyName>hg_fac_avg_pw_dist_km_23</ogc:PropertyName>
                <ogc:Literal>19.3</ogc:Literal>
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

        <!-- 19.3 - 22.8 -->
        <Rule>
          <Title>19.3 - 22.8</Title>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsGreaterThan>
                <ogc:PropertyName>hg_fac_avg_pw_dist_km_23</ogc:PropertyName>
                <ogc:Literal>19.3</ogc:Literal>
              </ogc:PropertyIsGreaterThan>
              <ogc:PropertyIsLessThanOrEqualTo>
                <ogc:PropertyName>hg_fac_avg_pw_dist_km_23</ogc:PropertyName>
                <ogc:Literal>22.8</ogc:Literal>
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
                <ogc:PropertyName>hg_fac_avg_pw_dist_km_23</ogc:PropertyName>
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
