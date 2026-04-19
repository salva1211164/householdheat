namespace UtilityProducedRecord.Main {

    const PRODUCT_TYPE_VALUES = {
        Solar_Panel: 1,
        Boiler: 2
    };
    
    const SOLAR_PANEL_FIELDS = ["hhh_averagehoursofsunlighth", "hhh_solarpanelwatts", "hhh_efficiency", "hhh_dailywatthours"];
    const BOILER_FIELDS = ["hhh_waterused", "hhh_energyused", "hhh_steamhotwaterproduced"];
    const ITEM_LOOKUP = "hhh_item"; // Ensure this is the exact logical name

    export async function onLoad(executionContext: Xrm.Events.EventContext) {
        const formContext = executionContext.getFormContext();

        // 1. Run on initial load
        retrieveProductTypeFromUtility(executionContext);

        // 2. Add an onChange listener so it runs when the user selects/changes the Item
        const itemAttribute = formContext.getAttribute(ITEM_LOOKUP);
        if (itemAttribute) {
            itemAttribute.addOnChange(retrieveProductTypeFromUtility);
        } else {
            console.error(`CRITICAL: Field ${ITEM_LOOKUP} is not on the form!`);
        }
    }

    export async function retrieveProductTypeFromUtility(executionContext: Xrm.Events.EventContext): Promise<void> {
        const formContext = executionContext.getFormContext();

        // Always hide everything first to create a clean slate
        hideAllFields(executionContext);

        const itemLookup = formContext.getAttribute<Xrm.Attributes.LookupAttribute>(ITEM_LOOKUP)?.getValue();

        if (!itemLookup || !itemLookup[0]) {
            console.info("No Item selected. Fields remain hidden.");
            return; // Exit gracefully, fields are already hidden
        }

        const itemId = itemLookup[0].id.replace("{", "").replace("}", "");

        try {
            // Hop One: Query the Item
            const itemRecord = await Xrm.WebApi.retrieveRecord("hhh_item", itemId, "?$select=_hhh_product_value");
            const productId = itemRecord["_hhh_product_value"];

            if (!productId) {
                console.warn("The linked Item does not have a Product assigned.");
                return;
            }

            // Hop Two: Query the Product
            const productRecord = await Xrm.WebApi.retrieveRecord("hhh_product", productId, "?$select=hhh_type");
            const productTypeValue = productRecord["hhh_type"];

            if (productTypeValue === PRODUCT_TYPE_VALUES.Solar_Panel) {
                showFields(executionContext, SOLAR_PANEL_FIELDS);
            } else if (productTypeValue === PRODUCT_TYPE_VALUES.Boiler) {
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
        
        // Combine both arrays and hide them all
        const allFields = [...SOLAR_PANEL_FIELDS, ...BOILER_FIELDS];
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

        fields.forEach(field => {
            const control = formContext.getControl<Xrm.Controls.StandardControl>(field);
            if (control) control.setVisible(true);
        });
    }
}