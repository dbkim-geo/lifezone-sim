<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.0.0"
  xmlns="http://www.opengis.net/sld"
  xmlns:ogc="http://www.opengis.net/ogc"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd">

  <NamedLayer>
    <Name>lifesim:current_basic_living_zone</Name>

    <UserStyle>
      <Name>cp_ngh_fac_dist_cor_avg_23</Name>
      <Title>cp_ngh_fac_dist_cor_avg_23 (km)</Title>
      <Abstract>5-class blue scale for cp_ngh_fac_dist_cor_avg_23</Abstract>

      <FeatureTypeStyle>

        <!-- 0.8 - 6.1 -->
        <Rule>
          <Title>0.8 - 6.1</Title>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsGreaterThanOrEqualTo>
                <ogc:PropertyName>cp_ngh_fac_dist_cor_avg_23</ogc:PropertyName>
                <ogc:Literal>0.8</ogc:Literal>
              </ogc:PropertyIsGreaterThanOrEqualTo>
              <ogc:PropertyIsLessThanOrEqualTo>
                <ogc:PropertyName>cp_ngh_fac_dist_cor_avg_23</ogc:PropertyName>
                <ogc:Literal>6.1</ogc:Literal>
              </ogc:PropertyIsLessThanOrEqualTo>
            </ogc:And>
          </ogc:Filter>
          <PolygonSymbolizer>
            <Fill>
              <CssParameter name="fill">#eef4fb</CssParameter> <!-- very light blue -->
              <CssParameter name="fill-opacity">0.9</CssParameter>
            </Fill>
            <Stroke>
              <CssParameter name="stroke">#2f4a63</CssParameter>
              <CssParameter name="stroke-width">0.8</CssParameter>
            </Stroke>
          </PolygonSymbolizer>
        </Rule>

        <!-- 6.1 - 11.4 -->
        <Rule>
          <Title>6.1 - 11.4</Title>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsGreaterThan>
                <ogc:PropertyName>cp_ngh_fac_dist_cor_avg_23</ogc:PropertyName>
                <ogc:Literal>6.1</ogc:Literal>
              </ogc:PropertyIsGreaterThan>
              <ogc:PropertyIsLessThanOrEqualTo>
                <ogc:PropertyName>cp_ngh_fac_dist_cor_avg_23</ogc:PropertyName>
                <ogc:Literal>11.4</ogc:Literal>
              </ogc:PropertyIsLessThanOrEqualTo>
            </ogc:And>
          </ogc:Filter>
          <PolygonSymbolizer>
            <Fill>
              <CssParameter name="fill">#c6d6ec</CssParameter> <!-- soft blue -->
              <CssParameter name="fill-opacity">0.9</CssParameter>
            </Fill>
            <Stroke>
              <CssParameter name="stroke">#2f4a63</CssParameter>
              <CssParameter name="stroke-width">0.8</CssParameter>
            </Stroke>
          </PolygonSymbolizer>
        </Rule>

        <!-- 11.4 - 16.7 -->
        <Rule>
          <Title>11.4 - 16.7</Title>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsGreaterThan>
                <ogc:PropertyName>cp_ngh_fac_dist_cor_avg_23</ogc:PropertyName>
                <ogc:Literal>11.4</ogc:Literal>
              </ogc:PropertyIsGreaterThan>
              <ogc:PropertyIsLessThanOrEqualTo>
                <ogc:PropertyName>cp_ngh_fac_dist_cor_avg_23</ogc:PropertyName>
                <ogc:Literal>16.7</ogc:Literal>
              </ogc:PropertyIsLessThanOrEqualTo>
            </ogc:And>
          </ogc:Filter>
          <PolygonSymbolizer>
            <Fill>
              <CssParameter name="fill">#72a9cc</CssParameter> <!-- mid blue -->
              <CssParameter name="fill-opacity">0.9</CssParameter>
            </Fill>
            <Stroke>
              <CssParameter name="stroke">#26425d</CssParameter>
              <CssParameter name="stroke-width">0.8</CssParameter>
            </Stroke>
          </PolygonSymbolizer>
        </Rule>

        <!-- 16.7 - 22 -->
        <Rule>
          <Title>16.7 - 22</Title>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsGreaterThan>
                <ogc:PropertyName>cp_ngh_fac_dist_cor_avg_23</ogc:PropertyName>
                <ogc:Literal>16.7</ogc:Literal>
              </ogc:PropertyIsGreaterThan>
              <ogc:PropertyIsLessThanOrEqualTo>
                <ogc:PropertyName>cp_ngh_fac_dist_cor_avg_23</ogc:PropertyName>
                <ogc:Literal>22</ogc:Literal>
              </ogc:PropertyIsLessThanOrEqualTo>
            </ogc:And>
          </ogc:Filter>
          <PolygonSymbolizer>
            <Fill>
              <CssParameter name="fill">#2f75b7</CssParameter> <!-- strong blue -->
              <CssParameter name="fill-opacity">0.9</CssParameter>
            </Fill>
            <Stroke>
              <CssParameter name="stroke">#1f3f63</CssParameter>
              <CssParameter name="stroke-width">0.8</CssParameter>
            </Stroke>
          </PolygonSymbolizer>
        </Rule>

        <!-- 22 - 27.3 -->
        <Rule>
          <Title>22 - 27.3</Title>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsGreaterThan>
                <ogc:PropertyName>cp_ngh_fac_dist_cor_avg_23</ogc:PropertyName>
                <ogc:Literal>22</ogc:Literal>
              </ogc:PropertyIsGreaterThan>
              <ogc:PropertyIsLessThanOrEqualTo>
                <ogc:PropertyName>cp_ngh_fac_dist_cor_avg_23</ogc:PropertyName>
                <ogc:Literal>27.3</ogc:Literal>
              </ogc:PropertyIsLessThanOrEqualTo>
            </ogc:And>
          </ogc:Filter>
          <PolygonSymbolizer>
            <Fill>
              <CssParameter name="fill">#08306b</CssParameter> <!-- deep navy -->
              <CssParameter name="fill-opacity">0.9</CssParameter>
            </Fill>
            <Stroke>
              <CssParameter name="stroke">#0a2346</CssParameter>
              <CssParameter name="stroke-width">0.8</CssParameter>
            </Stroke>
          </PolygonSymbolizer>
        </Rule>

        <!-- No Data -->
        <Rule>
          <Title>No Data</Title>
          <ogc:Filter>
            <ogc:PropertyIsNull>
              <ogc:PropertyName>cp_ngh_fac_dist_cor_avg_23</ogc:PropertyName>
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
