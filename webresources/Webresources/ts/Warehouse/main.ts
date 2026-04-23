namespace Warehouse.Main {
    /** 
     * Constants related to the Warehouse Main functionality.
     */
    const TYPE_OF_PRODUCT = 'hhh_typeofproduct';
    const WEIGHT = 'hhh_weight';
    const PRODUCT_TYPE_VALUES = {
        Items: 2,
        Units: 1,
        RawMaterial: 0,
    };
    const ITEM_SECTION = 'section_items';
    const UNIT_SECTION = 'section_units';
    const RAW_MATERIAL_SECTION = 'section_rawmaterials';
    const TAB_GENERAL = 'tab_general';
    const CONTAINER_SECTION = 'section_containers';
    const MAP_SECTION = 'section_map';

    /**
     * Handles the form's onLoad.
     * 
     */
    export async function onLoad(executionContext: Xrm.Events.EventContext) {
        const formContext = executionContext.getFormContext();
        
        showContainerSection(executionContext);
        showMapSection(executionContext);
    }

    /**
     * Shows or hides the container section based on the form state (new or existing record).
     */
    function showContainerSection(executionContext: Xrm.Events.EventContext): void {
        const formContext = executionContext.getFormContext();

        const isNewRecord = formContext.ui.getFormType() === 1; //1 stands for create form type
    
        const generalTab = formContext.ui.tabs.get(TAB_GENERAL);
        if (!generalTab) {
            console.warn(`Tab ${TAB_GENERAL} is missing from the form.`);
            return;
        }

        const containerSection = generalTab.sections.get(CONTAINER_SECTION);
        if (!containerSection) {
            console.warn(`Section ${CONTAINER_SECTION} is missing from the form.`);
            return;
        }

        //If the record is new, the container section will be hidden, otherwise it will be shown
        containerSection.setVisible(!isNewRecord);

    }

    /**
     * Shows the map section based on the form state (new or already existing)
     */
    function showMapSection(executionContext: Xrm.Events.EventContext): void {
        const formContext = executionContext.getFormContext();

        const isNewRecord = formContext.ui.getFormType() === 1;

        const generalTab = formContext.ui.tabs.get(TAB_GENERAL);
        if (!generalTab) {
            console.warn(`Tab ${TAB_GENERAL} is missing from the form.`);
            return;
        }

        const mapSection = generalTab.sections.get(MAP_SECTION);
        if (!mapSection) {
            console.warn(`Section ${MAP_SECTION} is missing from the form.`);
            return;
        }

        mapSection.setVisible(!isNewRecord);
    }
}