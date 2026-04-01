namespace Item.Main {
    /** 
     * Constants related to the Item Main functionality.
     */
    const WORKING_CONDITION = 'hhh_workingcondition';
    
    const DEFAULT_WORKING_CONDITION = 100;

    export async function onLoad(executionContext: Xrm.Events.EventContext) {
        const formContext = executionContext.getFormContext();
        const workingConditionControl = formContext.getControl<Xrm.Controls.StandardControl>(WORKING_CONDITION);
        const workingConditionAttribute = formContext.getAttribute<Xrm.Attributes.NumberAttribute>(WORKING_CONDITION);
        const isNewRecord = formContext.ui.getFormType() === 1;

        if (isNewRecord) {
            workingConditionControl.setVisible(false);
            workingConditionAttribute.setValue(DEFAULT_WORKING_CONDITION);
        } else {
            workingConditionControl.setVisible(true);
            workingConditionControl.setDisabled(true);
        }
    }

}