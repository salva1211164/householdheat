namespace Maintenance.Main {

    // Constants related to the Maintenance Main functionality (issue type values is a list for future scalability).
    const ISSUE_TYPE = 'hhh_issuetype';

    const ISSUE_TYPE_VALUES = {
        NO_DIAGNOSTIC: 3,
    };

    export function onLoad(executionContext: Xrm.Events.EventContext): void {

        warnOfNoIssueIdentified (executionContext);

        if ((executionContext as any).getEventArgs().getDataLoadState() === 1) {
            executionContext.getFormContext().getAttribute(ISSUE_TYPE).addOnChange(warnOfNoIssueIdentified);
        }

    }

    function warnOfNoIssueIdentified(executionContext: Xrm.Events.EventContext): void {
        const formContext = executionContext.getFormContext();

        const issueType = formContext.getAttribute(ISSUE_TYPE).getValue();
    
        formContext.ui.clearFormNotification('warnOfNoIssueIdentified');

        if (issueType === ISSUE_TYPE_VALUES.NO_DIAGNOSTIC) {

            formContext.ui.setFormNotification(
                'This Maintenance record has no issue identified',
                'WARNING',
                'warnOfNoIssueIdentified',
            );

        }

    }

}