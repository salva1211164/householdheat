namespace Item.Main {
    /** 
     * Constants related to the Item Main functionality.
     */
    const WORKING_CONDITION = 'hhh_workingcondition';
    const DEFAULT_WORKING_CONDITION = 100;

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
        const isNewRecord = formContext.ui.getFormType() === 1; //1 corresponds to when the form is created but not yet saved

        if (isNewRecord) {
            workingConditionControl.setVisible(false);
            workingConditionAttribute.setValue(DEFAULT_WORKING_CONDITION);
        } else { //if the has already been created
            workingConditionControl.setVisible(true);
            workingConditionControl.setDisabled(true); //locks the field
        }
    }

}