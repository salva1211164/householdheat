namespace Item.Main {
    /** 
     * Constants related to the Item Main functionality.
     */
    const WORKING_CONDITION = 'hhh_workingcondition';
    const CREATION_DATE = 'hhh_creationdate';
    const CREATED_ON = 'createdon';
    const DEFAULT_WORKING_CONDITION = 100;
    const TAB_UTILITY = 'tab_utility';
    const SOLAR_PANEL_SECTION = 'section_utility_records_solar_panel';
    const BOILER_SECTION = 'section_utility_records_boiler';
    const ITEM_PRODUCT = "hhh_product";
    const PRODUCT_TYPE = "hhh_type";
    const PRODUCT_TYPE_VALUES = {
        Solar_Panel: 1,
        Boiler: 2
    };

    /**
     * Handles the form's onLoad.
     * 
     * The Working Condition field is hidden and set to a default value when
     * the form is in a create state. When the form is in an update state (after
     * being created), the Working Condition field becomes visible but locked.
     * 
     */

    export async function onLoad(executionContext: Xrm.Events.EventContext) {
        const formContext = executionContext.getFormContext();
        //get working condition control and attribute in order to be able to set visibility and default values
        const workingConditionControl = formContext.getControl<Xrm.Controls.StandardControl>(WORKING_CONDITION);
        const workingConditionAttribute = formContext.getAttribute<Xrm.Attributes.NumberAttribute>(WORKING_CONDITION);
        //get creation date attribute in order to set the default value based on the created on field
        const creationDateAttribute = formContext.getAttribute<Xrm.Attributes.DateAttribute>(CREATION_DATE);
        const createdOnAttribute = formContext.getAttribute<Xrm.Attributes.DateAttribute>(CREATED_ON);
        const isNewRecord = formContext.ui.getFormType() === 1; //1 corresponds to when the form is created but not yet saved

        toggleSubgridSections(executionContext);

        if (isNewRecord) {
            workingConditionControl.setVisible(false);
            workingConditionAttribute.setValue(DEFAULT_WORKING_CONDITION);
        } else { //if the has already been created, show and lock working condition, and set creation date value if it is not already set
            if (creationDateAttribute.getValue() === null && createdOnAttribute.getValue() !== null) {
                creationDateAttribute.setValue(createdOnAttribute.getValue());
            }
            workingConditionControl.setVisible(true);
            workingConditionControl.setDisabled(true);
        }

        if ((executionContext as any).getEventArgs().getDataLoadState() === 1) {
            formContext.getAttribute(ITEM_PRODUCT).addOnChange(toggleSubgridSections);
        }
    }

    /**
     * Handles the retirement of an item when triggered from the ribbon
     */
    export async function retireItem(primaryControl: Xrm.FormContext): Promise<void> {
        const formContext = primaryControl;
        const itemId = formContext.data.entity.getId();

        const confirm = await Xrm.Navigation.openConfirmDialog({
            title: 'Retire Item',
            text: 'Do you want to retire the selected Item? This action will change the status of the selected Item to Inactive.',
        });

        if (!confirm.confirmed) return;

        await Xrm.WebApi.updateRecord('hhh_item', itemId, {
            statecode: 1, //Inactive status code
            statuscode: 814960004, //Retired Status Reason Code
        });

        await formContext.data.refresh(false);
    }

    /**
     * Core logic to evaluate the type of Item and hide/show the respective utility record subgrid sections accordingly.
     */
    function toggleSubgridSections(executionContext: Xrm.Events.EventContext): void {
        const formContext = executionContext.getFormContext();

        const productValue = formContext.getAttribute<Xrm.Attributes.LookupAttribute>(ITEM_PRODUCT)?.getValue();
        
        if (!productValue || productValue.length === 0) {
            console.warn(`Attribute ${ITEM_PRODUCT} is missing from the form.`);
            return;
        }

        const productId = productValue[0].id.replace("{", "").replace("}", "");

        const tab = formContext.ui.tabs.get(TAB_UTILITY);
        if (!tab) {
            console.warn(`Tab ${TAB_UTILITY} is missing from the form.`);
            return;
        }

        //get the subgrid sections
        const solarPanelSection = tab.sections.get(SOLAR_PANEL_SECTION);
        const boilerSection = tab.sections.get(BOILER_SECTION);

        //by default, hide both sections
        if (solarPanelSection) solarPanelSection.setVisible(false);
        if (boilerSection) boilerSection.setVisible(false);

        //retrieve the product record to get the product type
        Xrm.WebApi.retrieveRecord(ITEM_PRODUCT, productId, "?$select=hhh_type").then(
            function success(result) {
                // Getting the text label instead of the number
                const productTypeText = result["hhh_type@OData.Community.Display.V1.FormattedValue"];
                const productTypeValue = result[PRODUCT_TYPE];
                
                //added for debugging
                console.log("Product Type Label:", productTypeText);

                switch (productTypeValue) {
                    case PRODUCT_TYPE_VALUES.Solar_Panel:
                        if (solarPanelSection) solarPanelSection.setVisible(true);
                        break;
                    case PRODUCT_TYPE_VALUES.Boiler:
                        if (boilerSection) boilerSection.setVisible(true);
                        break;
                    default:
                        break;
                }
                
            },
            function (error) {
                console.error("Error fetching product type:", error.message);
            }
        );
    }
}