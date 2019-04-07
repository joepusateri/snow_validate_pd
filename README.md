# snow_validate_pd

The validate.js script will check to see if the PagerDuty integration in ServiceNow 
is configured correctly.

## How to run it

### Background Script

In ServiceNow, type "Scripts - Background" in the Filter Navigator at the top left of the page 
and choose that item from "System Definition -> Scripts - Background". Then paste the contents
of Validate.js into the text box. Next, at the bottom of the text box, make sure that the scope
is "x_pd_integration". Now choose the "Run script" button.

### Fix Script

In ServiceNow, Type "Fix Scripts" in the Filter Navigator at the top left of the page 
and choose that item from "System Definition -> Fix Scripts". Choose "New" at the top. Give the script
a name and uncheck "Run Once". Next. paste the contents of Validate.js into the Script box and Submit.
Now you can choose "Run Fix Script" at the top right.

## What the Script checks for

* ServiceNow Assignment Groups with:
  * an unknown Escalation Policy ID in PagerDuty
  * no Service ID or Webhook ID (when configured for Assignment Group only)
  * an unknown Service ID in PagerDuty (when configured for Assignment Group only)
  * an unknown Webhook ID in PagerDuty (when configured for Assignment Group only)
  * a Webhook ID whose parent Service is not the Service ID in the Assignment Group (when configured for Assignment Group only)
* ServiceNow Configuration Items with:
  * no Service ID or Webhook ID (when configured for Configuration Items and Assignment Groups)
  * an unknown Service ID in PagerDuty (when configured for Configuration Items and Assignment Groups)
  * an unknown Webhook ID in PagerDuty (when configured for Configuration Items and Assignment Groups)
  * a Webhook ID whose parent Service is not the Service ID in the Configuration Item (when configured for Configuration Items and Assignment Groups)
* PagerDuty Services with ServiceNow Extensions that do not have any provisioned Service ID entries in Assignment Groups or Configuration Items 

## Script Output
The output of the script is located at the bottom of the printed output and is an INFO log type.