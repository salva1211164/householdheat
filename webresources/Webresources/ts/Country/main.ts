namespace Country.Main {

    //Handles the form's onLoad.
    export async function onLoad(executionContext: Xrm.Events.EventContext) {
        const formContext = executionContext.getFormContext();
        const isNewRecord = formContext.ui.getFormType() === 1; //1 corresponds to when the form is created
        
        if (isNewRecord) {//If the country record is being created
            changeFactoriesSectionVisibility(formContext, false);
        } else {//If the country record has already been created
            changeFactoriesSectionVisibility(formContext, true);
        }
    }

    //Changes the visibility of the factories subgrid section
    function changeFactoriesSectionVisibility(formContext: Xrm.FormContext, isVisible: boolean): void {

        const tab = formContext.ui.tabs.get('tab_general');
        if (!tab) {
            console.warn('Tab tab_general is missing from the form.');
            return;
        }

        const factoriesSection = tab.sections.get('section_factories');
        if (!factoriesSection) {
            console.warn('Section section_factories is missing from the form.');
            return;
        }

        //set the sections visibility based on the isVisible parameter
        factoriesSection.setVisible(isVisible);
    }
}