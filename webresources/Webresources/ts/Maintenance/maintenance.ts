namespace Maintenance.Main {

    //Constants related to the Maintenance Main functionality
    const ISSUE_TYPE = 'hhh_issuetype';

    const ISSUE_TYPE_VALUES = { //list for future scability even though currently there is only one value
        NO_DIAGNOSTIC: 3,
    };

    /*
    * Function to be executed on the load of the form
    */
    export function onLoad(executionContext: Xrm.Events.EventContext): void {

        //in case is an existing record
        warnOfNoIssueIdentified (executionContext);

        if ((executionContext as any).getEventArgs().getDataLoadState() === 1) {
            executionContext.getFormContext().getAttribute(ISSUE_TYPE).addOnChange(warnOfNoIssueIdentified);
        }

    }

    /**
    * Function to warn the user if no issue has been identified for this Maintenance record
    */
    function warnOfNoIssueIdentified(executionContext: Xrm.Events.EventContext): void {
        const formContext = executionContext.getFormContext();

        const issueType = formContext.getAttribute(ISSUE_TYPE).getValue();
    
        //clear previous notification
        formContext.ui.clearFormNotification('warnOfNoIssueIdentified');

        if (issueType === ISSUE_TYPE_VALUES.NO_DIAGNOSTIC) {

            //send a warning notification
            formContext.ui.setFormNotification(
                'This Maintenance record has no issue identified',
                'WARNING',
                'warnOfNoIssueIdentified',
            );

        }

    }

}