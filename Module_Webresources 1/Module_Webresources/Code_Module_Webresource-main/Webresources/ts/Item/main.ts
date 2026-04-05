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
        } else { //if the has already been created, show and lock the field
            workingConditionControl.setVisible(true);
            workingConditionControl.setDisabled(true);
        }
    }

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
}