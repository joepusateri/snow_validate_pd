# snow_validate_pd

The validate.js script will check to see if the PagerDuty integration in ServiceNow 
is configured correctly.

## How to run it

### As a Background Script

1. In ServiceNow, type "Scripts - Background" in the Filter Navigator at the top left of the page 
1. Choose that item from "System Definition -> Scripts - Background". 
1. Paste the contents of Validate.js into the text box. 
1. At the bottom of the text box, make sure that the scope is "x_pd_integration".
1. Choose the "Run script" button.

### As a Fix Script

1. In ServiceNow, Type "Fix Scripts" in the Filter Navigator at the top left of the page 
1. Choose that item from "System Definition -> Fix Scripts". 
1. Choose "New" at the top. 
1. Give the script a name and uncheck "Run Once". 
1. Paste the contents of Validate.js into the Script box.
1. Click Submit.
1. Choose "Run Fix Script" at the top right.

## What the Script checks for

The script will report on any:

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