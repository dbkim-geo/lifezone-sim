<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.0.0"
  xmlns="http://www.opengis.net/sld"
  xmlns:ogc="http://www.opengis.net/ogc"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd">

  <NamedLayer>
    <Name>lifesim:current_basic_living_zone</Name>

    <UserStyle>
      <Name>nt_pt_acc_1hr_center_cnt_23</Name>
      <Title>nt_pt_acc_1hr_center_cnt_23 (count)</Title>
      <Abstract>5-class green scale for nt_pt_acc_1hr_center_cnt_23</Abstract>

      <FeatureTypeStyle>

        <!-- 0 - 2.8 -->
        <Rule>
          <Title>0 - 2.8</Title>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsGreaterThanOrEqualTo>
                <ogc:PropertyName>nt_pt_acc_1hr_center_cnt_23</ogc:PropertyName>
                <ogc:Literal>0</ogc:Literal>
              </ogc:PropertyIsGreaterThanOrEqualTo>
              <ogc:PropertyIsLessThanOrEqualTo>
                <ogc:PropertyName>nt_pt_acc_1hr_center_cnt_23</ogc:PropertyName>
                <ogc:Literal>2.8</ogc:Literal>
              </ogc:PropertyIsLessThanOrEqualTo>
            </ogc:And>
          </ogc:Filter>
          <PolygonSymbolizer>
            <!-- very light mint green -->
            <Fill>
              <CssParameter name="fill">#eef8ec</CssParameter>
              <CssParameter name="fill-opacity">0.9</CssParameter>
            </Fill>
            <Stroke>
              <CssParameter name="stroke">#2e5d2e</CssParameter>
              <CssParameter name="stroke-width">0.8</CssParameter>
            </Stroke>
          </PolygonSymbolizer>
        </Rule>

        <!-- 2.8 - 5.6 -->
        <Rule>
          <Title>2.8 - 5.6</Title>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsGreaterThan>
                <ogc:PropertyName>nt_pt_acc_1hr_center_cnt_23</ogc:PropertyName>
                <ogc:Literal>2.8</ogc:Literal>
              </ogc:PropertyIsGreaterThan>
              <ogc:PropertyIsLessThanOrEqualTo>
                <ogc:PropertyName>nt_pt_acc_1hr_center_cnt_23</ogc:PropertyName>
                <ogc:Literal>5.6</ogc:Literal>
              </ogc:PropertyIsLessThanOrEqualTo>
            </ogc:And>
          </ogc:Filter>
          <PolygonSymbolizer>
            <!-- light green -->
            <Fill>
              <CssParameter name="fill">#c8e6c9</CssParameter>
              <CssParameter name="fill-opacity">0.9</CssParameter>
            </Fill>
            <Stroke>
              <CssParameter name="stroke">#2e5d2e</CssParameter>
              <CssParameter name="stroke-width">0.8</CssParameter>
            </Stroke>
          </PolygonSymbolizer>
        </Rule>

        <!-- 5.6 - 8.4 -->
        <Rule>
          <Title>5.6 - 8.4</Title>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsGreaterThan>
                <ogc:PropertyName>nt_pt_acc_1hr_center_cnt_23</ogc:PropertyName>
                <ogc:Literal>5.6</ogc:Literal>
              </ogc:PropertyIsGreaterThan>
              <ogc:PropertyIsLessThanOrEqualTo>
                <ogc:PropertyName>nt_pt_acc_1hr_center_cnt_23</ogc:PropertyName>
                <ogc:Literal>8.4</ogc:Literal>
              </ogc:PropertyIsLessThanOrEqualTo>
            </ogc:And>
          </ogc:Filter>
          <PolygonSymbolizer>
            <!-- mid green -->
            <Fill>
              <CssParameter name="fill">#81c784</CssParameter>
              <CssParameter name="fill-opacity">0.9</CssParameter>
            </Fill>
            <Stroke>
              <CssParameter name="stroke">#2d5c2d</CssParameter>
              <CssParameter name="stroke-width">0.8</CssParameter>
            </Stroke>
          </PolygonSymbolizer>
        </Rule>

        <!-- 8.4 - 11.2 -->
        <Rule>
          <Title>8.4 - 11.2</Title>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsGreaterThan>
                <ogc:PropertyName>nt_pt_acc_1hr_center_cnt_23</ogc:PropertyName>
                <ogc:Literal>8.4</ogc:Literal>
              </ogc:PropertyIsGreaterThan>
              <ogc:PropertyIsLessThanOrEqualTo>
                <ogc:PropertyName>nt_pt_acc_1hr_center_cnt_23</ogc:PropertyName>
                <ogc:Literal>11.2</ogc:Literal>
              </ogc:PropertyIsLessThanOrEqualTo>
            </ogc:And>
          </ogc:Filter>
          <PolygonSymbolizer>
            <!-- strong green -->
            <Fill>
              <CssParameter name="fill">#388e3c</CssParameter>
              <CssParameter name="fill-opacity">0.9</CssParameter>
            </Fill>
            <Stroke>
              <CssParameter name="stroke">#1e4021</CssParameter>
              <CssParameter name="stroke-width">0.8</CssParameter>
            </Stroke>
          </PolygonSymbolizer>
        </Rule>

        <!-- 11.2 - 14 -->
        <Rule>
          <Title>11.2 - 14</Title>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsGreaterThan>
                <ogc:PropertyName>nt_pt_acc_1hr_center_cnt_23</ogc:PropertyName>
                <ogc:Literal>11.2</ogc:Literal>
              </ogc:PropertyIsGreaterThan>
              <ogc:PropertyIsLessThanOrEqualTo>
                <ogc:PropertyName>nt_pt_acc_1hr_center_cnt_23</ogc:PropertyName>
                <ogc:Literal>14</ogc:Literal>
              </ogc:PropertyIsLessThanOrEqualTo>
            </ogc:And>
          </ogc:Filter>
          <PolygonSymbolizer>
            <!-- deep forest green -->
            <Fill>
              <CssParameter name="fill">#0b3d17</CssParameter>
              <CssParameter name="fill-opacity">0.9</CssParameter>
            </Fill>
            <Stroke>
              <CssParameter name="stroke">#06260e</CssParameter>
              <CssParameter name="stroke-width">0.8</CssParameter>
            </Stroke>
          </PolygonSymbolizer>
        </Rule>

        <!-- No Data -->
        <Rule>
          <Title>No Data</Title>
          <ogc:Filter>
            <ogc:PropertyIsNull>
              <ogc:PropertyName>nt_pt_acc_1hr_center_cnt_23</ogc:PropertyName>
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
