<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.0.0"
  xmlns="http://www.opengis.net/sld"
  xmlns:ogc="http://www.opengis.net/ogc"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd">

  <NamedLayer>
    <Name>lifesim:current_basic_living_zone</Name>

    <UserStyle>
      <Name>r90m_rd_add_hg_fac_type_cnt_23</Name>
      <Title>r90m_rd_add_hg_fac_type_cnt_23 (count)</Title>
      <Abstract>5-class red scale for r90m_rd_add_hg_fac_type_cnt_23</Abstract>

      <FeatureTypeStyle>

        <!-- 0 - 0.8 -->
        <Rule>
          <Title>0 - 0.8</Title>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsGreaterThanOrEqualTo>
                <ogc:PropertyName>r90m_rd_add_hg_fac_type_cnt_23</ogc:PropertyName>
                <ogc:Literal>0</ogc:Literal>
              </ogc:PropertyIsGreaterThanOrEqualTo>
              <ogc:PropertyIsLessThanOrEqualTo>
                <ogc:PropertyName>r90m_rd_add_hg_fac_type_cnt_23</ogc:PropertyName>
                <ogc:Literal>0.8</ogc:Literal>
              </ogc:PropertyIsLessThanOrEqualTo>
            </ogc:And>
          </ogc:Filter>

          <PolygonSymbolizer>
            <!-- lightest peach -->
            <Fill>
              <CssParameter name="fill">#fee5d9</CssParameter>
              <CssParameter name="fill-opacity">0.9</CssParameter>
            </Fill>
            <Stroke>
              <CssParameter name="stroke">#a50f15</CssParameter>
              <CssParameter name="stroke-width">0.8</CssParameter>
            </Stroke>
          </PolygonSymbolizer>
        </Rule>

        <!-- 0.8 - 1.6 -->
        <Rule>
          <Title>0.8 - 1.6</Title>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsGreaterThan>
                <ogc:PropertyName>r90m_rd_add_hg_fac_type_cnt_23</ogc:PropertyName>
                <ogc:Literal>0.8</ogc:Literal>
              </ogc:PropertyIsGreaterThan>
              <ogc:PropertyIsLessThanOrEqualTo>
                <ogc:PropertyName>r90m_rd_add_hg_fac_type_cnt_23</ogc:PropertyName>
                <ogc:Literal>1.6</ogc:Literal>
              </ogc:PropertyIsLessThanOrEqualTo>
            </ogc:And>
          </ogc:Filter>

          <PolygonSymbolizer>
            <!-- light salmon -->
            <Fill>
              <CssParameter name="fill">#fcbba1</CssParameter>
              <CssParameter name="fill-opacity">0.9</CssParameter>
            </Fill>
            <Stroke>
              <CssParameter name="stroke">#a50f15</CssParameter>
              <CssParameter name="stroke-width">0.8</CssParameter>
            </Stroke>
          </PolygonSymbolizer>
        </Rule>

        <!-- 1.6 - 2.4 -->
        <Rule>
          <Title>1.6 - 2.4</Title>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsGreaterThan>
                <ogc:PropertyName>r90m_rd_add_hg_fac_type_cnt_23</ogc:PropertyName>
                <ogc:Literal>1.6</ogc:Literal>
              </ogc:PropertyIsGreaterThan>
              <ogc:PropertyIsLessThanOrEqualTo>
                <ogc:PropertyName>r90m_rd_add_hg_fac_type_cnt_23</ogc:PropertyName>
                <ogc:Literal>2.4</ogc:Literal>
              </ogc:PropertyIsLessThanOrEqualTo>
            </ogc:And>
          </ogc:Filter>

          <PolygonSymbolizer>
            <!-- mid coral -->
            <Fill>
              <CssParameter name="fill">#fc704f</CssParameter>
              <CssParameter name="fill-opacity">0.9</CssParameter>
            </Fill>
            <Stroke>
              <CssParameter name="stroke">#93000d</CssParameter>
              <CssParameter name="stroke-width">0.8</CssParameter>
            </Stroke>
          </PolygonSymbolizer>
        </Rule>

        <!-- 2.4 - 3.2 -->
        <Rule>
          <Title>2.4 - 3.2</Title>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsGreaterThan>
                <ogc:PropertyName>r90m_rd_add_hg_fac_type_cnt_23</ogc:PropertyName>
                <ogc:Literal>2.4</ogc:Literal>
              </ogc:PropertyIsGreaterThan>
              <ogc:PropertyIsLessThanOrEqualTo>
                <ogc:PropertyName>r90m_rd_add_hg_fac_type_cnt_23</ogc:PropertyName>
                <ogc:Literal>3.2</ogc:Literal>
              </ogc:PropertyIsLessThanOrEqualTo>
            </ogc:And>
          </ogc:Filter>

          <PolygonSymbolizer>
            <!-- strong red -->
            <Fill>
              <CssParameter name="fill">#e31a1c</CssParameter>
              <CssParameter name="fill-opacity">0.9</CssParameter>
            </Fill>
            <Stroke>
              <CssParameter name="stroke">#7f0000</CssParameter>
              <CssParameter name="stroke-width">0.8</CssParameter>
            </Stroke>
          </PolygonSymbolizer>
        </Rule>

        <!-- 3.2 - 4 -->
        <Rule>
          <Title>3.2 - 4</Title>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsGreaterThan>
                <ogc:PropertyName>r90m_rd_add_hg_fac_type_cnt_23</ogc:PropertyName>
                <ogc:Literal>3.2</ogc:Literal>
              </ogc:PropertyIsGreaterThan>
              <ogc:PropertyIsLessThanOrEqualTo>
                <ogc:PropertyName>r90m_rd_add_hg_fac_type_cnt_23</ogc:PropertyName>
                <ogc:Literal>4</ogc:Literal>
              </ogc:PropertyIsLessThanOrEqualTo>
            </ogc:And>
          </ogc:Filter>

          <PolygonSymbolizer>
            <!-- deep crimson -->
            <Fill>
              <CssParameter name="fill">#b10026</CssParameter>
              <CssParameter name="fill-opacity">0.9</CssParameter>
            </Fill>
            <Stroke>
              <CssParameter name="stroke">#67000d</CssParameter>
              <CssParameter name="stroke-width">0.8</CssParameter>
            </Stroke>
          </PolygonSymbolizer>
        </Rule>

        <!-- No Data -->
        <Rule>
          <Title>No Data</Title>
          <ogc:Filter>
            <ogc:PropertyIsNull>
              <ogc:PropertyName>r90m_rd_add_hg_fac_type_cnt_23</ogc:PropertyName>
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
