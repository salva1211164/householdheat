namespace RawMaterial.View {

    /**
     * Raw material type option set values
     */
    const RAW_MATERIAL_TYPE_VALUES = {
        STAINLESS_STEEL:0,
        CARBON_STEEL:1,
        GLASS_FIBRE:2,
        ALUMINIUM:3,
        MAGNESIUM:4,
        CRYSTALLINE_SILICON:5,
        AMORPHOUS_SILICON:6,
        SOLUBLE_PLATINUM:7,
        GALLIUM_ARSENIDE:8,
    };

    /**
     * icon names - corresponding to the web resources names
     */
    const ICONS = {
        STEEL: 'hhh_icon_steel', //used for stainless steel and carbon steel
        GLASS:'hhh_icon_glass', //used for glass fibre
        LIGHT_METAL:'hhh_icon_lightmetal', //used for aluminium and magnesium
        SILICON:'hhh_icon_silicon', //used for crystalline silicon and amorphous silicon
        COMPOUND:'hhh_icon_compound', //used for soluble platinum and gallium arsenide
    };

    /**
     * Returns the icon web resource name and tooltip for a given raw material type
     * to be displayed in the Raw Material list view.
     *
     * @param rowData  - JSON string of the row data provided by the platform.
     * @param userLCID - The locale ID of the current user.
     * @returns An array of [webResourceName, tooltip].
     */
    export function getMaterialTypeIcon(rowData: string, userLCID: number): [string, string] {
        const data = JSON.parse(rowData);
        const materialType = parseInt(data.hhh_type_Value, 10);

        let imgName = '';
        let tooltip = '';

        switch (materialType) {
            case RAW_MATERIAL_TYPE_VALUES.STAINLESS_STEEL:
            case RAW_MATERIAL_TYPE_VALUES.CARBON_STEEL:
                imgName = ICONS.STEEL;
                tooltip = 'Steel';
                break;

            case RAW_MATERIAL_TYPE_VALUES.GLASS_FIBRE:
                imgName = ICONS.GLASS;
                tooltip = 'Glass';
                break;

            case RAW_MATERIAL_TYPE_VALUES.ALUMINIUM:
            case RAW_MATERIAL_TYPE_VALUES.MAGNESIUM:
                imgName = ICONS.LIGHT_METAL;
                tooltip = 'Light Metal';
                break;

            case RAW_MATERIAL_TYPE_VALUES.CRYSTALLINE_SILICON:
            case RAW_MATERIAL_TYPE_VALUES.AMORPHOUS_SILICON:
                imgName = ICONS.SILICON;
                tooltip = 'Silicon';
                break;

            case RAW_MATERIAL_TYPE_VALUES.SOLUBLE_PLATINUM:
            case RAW_MATERIAL_TYPE_VALUES.GALLIUM_ARSENIDE:
                imgName = ICONS.COMPOUND;
                tooltip = 'Compound';
                break;

            default:
                    break;
        }

        return [imgName, tooltip];
    }
}
