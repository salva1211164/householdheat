namespace Container.Main {
    /** 
     * Constants related to the Container Main functionality.
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
    const SIZE = 'hhh_size';
    const CAPACITY = 'hhh_capacity';
    const SIZE_VALUES = {
        '20ft': 0,
        '40ft': 1,
    };
    const CAPACITY_VALUES = {
        '4000kg': 0,
        '8000kg': 1,
    };

    /**
     * Handles the form's onLoad.
     * 
     * The Type of Product field is used to determine which sections should be visible on the form. 
     * When the form is in a create state, all sections are hidden until a Type of Product is selected. 
     * When the form is in an update state (after being created), the sections are shown or hidden based on the value of the Type of Product field.
     * 
     */
    export async function onLoad(executionContext: Xrm.Events.EventContext) {
        const formContext = executionContext.getFormContext();
        
        //needed in case it's an existing record
        toggleSubgridSections(executionContext);
        warnOfItemContainer(executionContext);

        if ((executionContext as any).getEventArgs().getDataLoadState() === 1) {
            formContext.getAttribute(TYPE_OF_PRODUCT).addOnChange(toggleSubgridSections);
            formContext.getAttribute(TYPE_OF_PRODUCT).addOnChange(warnOfItemContainer);
            formContext.getAttribute(TYPE_OF_PRODUCT).addOnChange(warnOfWrongStockInContainer);
            formContext.getAttribute(SIZE).addOnChange(setCapacityBasedOnSize);
        }
    }

    /**
     * Core logic to evaluate the type and hide/show sections accordingly.
     */
    function toggleSubgridSections(executionContext: Xrm.Events.EventContext): void {
        const formContext = executionContext.getFormContext();

        const typeAttribute = formContext.getAttribute<Xrm.Attributes.OptionSetAttribute>(TYPE_OF_PRODUCT);
        
        if (!typeAttribute) {
            console.warn(`Attribute ${TYPE_OF_PRODUCT} is missing from the form.`);
            return;
        }

        const tab = formContext.ui.tabs.get(TAB_GENERAL);
        if (!tab) {
            console.warn(`Tab ${TAB_GENERAL} is missing from the form.`);
            return;
        }

        //get the three sections
        const itemsSection = tab.sections.get(ITEM_SECTION);
        const unitsSection = tab.sections.get(UNIT_SECTION);
        const rawMaterialsSection = tab.sections.get(RAW_MATERIAL_SECTION);

        //by default, hide all sections
        if (itemsSection) itemsSection.setVisible(false);
        if (unitsSection) unitsSection.setVisible(false);
        if (rawMaterialsSection) rawMaterialsSection.setVisible(false);

        //get the value of type of product and show the respective section based on that value
        const typeValue = typeAttribute.getValue();

        switch (typeValue) {
            case PRODUCT_TYPE_VALUES.Items:
                if (itemsSection) itemsSection.setVisible(true);
                break;
            case PRODUCT_TYPE_VALUES.Units:
                if (unitsSection) unitsSection.setVisible(true);
                break;
            case PRODUCT_TYPE_VALUES.RawMaterial:
                if (rawMaterialsSection) rawMaterialsSection.setVisible(true);
                break;
            default:
                // If the field is null/empty, all sections remain hidden
                break;
        }
    }

    /**
     * If it's an Item Container, show a notification
     */
    function warnOfItemContainer (executionContext: Xrm.Events.EventContext): void {
        const formContext = executionContext.getFormContext();

        const typeAttribute = formContext.getAttribute<Xrm.Attributes.OptionSetAttribute>(TYPE_OF_PRODUCT);
    
        formContext.ui.clearFormNotification('warnOfItemContainer');

        if (typeAttribute.getValue() === PRODUCT_TYPE_VALUES.Items) {

            formContext.ui.setFormNotification(
                'This is an Item Container, be careful while dealing with it',
                'INFO',
                'warnOfItemContainer',
            );

        }

    }

    //Functions that send the user a warning when he changes the type of product in a container, and there's already stock in it from a different type
    function warnOfWrongStockInContainer (executionContext: Xrm.Events.EventContext): void {
        const formContext = executionContext.getFormContext();

        const weightAttribute = formContext.getAttribute<Xrm.Attributes.NumberAttribute>(WEIGHT);

        formContext.ui.clearFormNotification('warnOfWrongStockInContainer');

        if (weightAttribute.getValue() > 0) {

            formContext.ui.setFormNotification(
                'This container has stock, changing the type of product may cause issues with the existing stock',
                'WARNING',
                'warnOfWrongStockInContainer',
            );

        }
    }

    //Function that sets the capacity of the container based on the size selected, a 20ft container has a 4000kg capacity, while a 40ft container has an 8000kg capacity
    function setCapacityBasedOnSize (executionContext: Xrm.Events.EventContext): void {
        const formContext = executionContext.getFormContext();

        const sizeAttribute = formContext.getAttribute<Xrm.Attributes.OptionSetAttribute>(SIZE);
        const capacityAttribute = formContext.getAttribute<Xrm.Attributes.OptionSetAttribute>(CAPACITY);

        if (sizeAttribute.getValue() === SIZE_VALUES['20ft']) {
            capacityAttribute.setValue(CAPACITY_VALUES['4000kg']);
        } else if (sizeAttribute.getValue() === SIZE_VALUES['40ft']) {
            capacityAttribute.setValue(CAPACITY_VALUES['8000kg']);
        }
    
    }

}