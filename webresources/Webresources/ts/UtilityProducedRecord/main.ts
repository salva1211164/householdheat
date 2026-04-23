namespace UtilityProducedRecord.Main {

    //Constants for choice values and field names
    const PRODUCT_TYPE_VALUES = {
        Solar_Panel: 1,
        Boiler: 2
    };
    const SOLAR_PANEL_FIELDS = ["hhh_averagehoursofsunlighth", "hhh_solarpanelwatts", "hhh_efficiency", "hhh_dailywatthours"];
    const BOILER_FIELDS = ["hhh_waterused", "hhh_energyused", "hhh_steamhotwaterproduced"];
    const ITEM_LOOKUP = "hhh_item"; // Ensure this is the exact logical name

    /**
     * Handles form onLoad
     */
    export async function onLoad(executionContext: Xrm.Events.EventContext) {
        const formContext = executionContext.getFormContext();

        retrieveProductTypeFromUtility(executionContext);

        const itemAttribute = formContext.getAttribute(ITEM_LOOKUP);
        if (itemAttribute) { //if the item lookup is populated
            itemAttribute.addOnChange(retrieveProductTypeFromUtility);
        } else {
            console.error(`CRITICAL: Field ${ITEM_LOOKUP} is not on the form!`);
        }
    }

    export async function retrieveProductTypeFromUtility(executionContext: Xrm.Events.EventContext): Promise<void> {
        const formContext = executionContext.getFormContext();

        //hide every field by default
        hideAllFields(executionContext);

        //if there's no item selected, no action is needed
        const itemLookup = formContext.getAttribute<Xrm.Attributes.LookupAttribute>(ITEM_LOOKUP)?.getValue();
        if (!itemLookup || !itemLookup[0]) {
            console.info("No Item selected. Fields remain hidden.");
            return;
        }

        //"unwrap" the guid from the lookup value
        const itemId = itemLookup[0].id.replace("{", "").replace("}", "");

        try {
            
            //get the item record to retrieve the linked product
            const itemRecord = await Xrm.WebApi.retrieveRecord("hhh_item", itemId, "?$select=_hhh_product_value");
            const productId = itemRecord["_hhh_product_value"];
            if (!productId) {
                console.warn("The linked Item does not have a Product assigned.");
                return;
            }

            //get the product record to check the type
            const productRecord = await Xrm.WebApi.retrieveRecord("hhh_product", productId, "?$select=hhh_type");
            const productTypeValue = productRecord["hhh_type"];

            if (productTypeValue === PRODUCT_TYPE_VALUES.Solar_Panel) { //if it's a solar panel, show the solar panel fields
                showFields(executionContext, SOLAR_PANEL_FIELDS);
            } else if (productTypeValue === PRODUCT_TYPE_VALUES.Boiler) { //if it's a boiler, show the boiler fields
                showFields(executionContext, BOILER_FIELDS);
            } else {
                console.warn(`Unknown Product Type value: ${productTypeValue}`);
            }

        } catch (error: any) {
            console.error("Error retrieving Product Type chain:", error.message);
        }
    }

    /**
     * Hides all dynamic fields to reset the form state
     */
    function hideAllFields(executionContext: Xrm.Events.EventContext): void {
        const formContext = executionContext.getFormContext();
        
        //combine all fields in one array
        const allFields = [...SOLAR_PANEL_FIELDS, ...BOILER_FIELDS];
        //iterate through each field and hide it
        allFields.forEach(field => {
            const control = formContext.getControl<Xrm.Controls.StandardControl>(field);
            if (control) control.setVisible(false);
        });
    }

    /**
     * Shows the requested array of fields
     */
    function showFields(executionContext: Xrm.Events.EventContext, fields: string[]): void {
        const formContext = executionContext.getFormContext();

        //iterate through each field and show it
        fields.forEach(field => {
            const control = formContext.getControl<Xrm.Controls.StandardControl>(field);
            if (control) control.setVisible(true);
        });
    }
}