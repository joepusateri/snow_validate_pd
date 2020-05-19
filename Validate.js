var me = "Validate"; 
var JSON = new global.JSON(); 

var sn2pdMappingCIAG = "Configuration Items and Assignment Groups map to PagerDuty"; 
var sn2pdMappingAG = "Assignment Groups map to PagerDuty"; 
var sn2pdMapping = gs.getProperty("x_pd_integration.sn2pd_mapping"); 

var CIAG = (sn2pdMapping == sn2pdMappingCIAG); 


var output = "\nValidation starting..."; 
var services = new Array();
var pd = new x_pd_integration.PagerDuty(); 
var rest = new x_pd_integration.PagerDuty_REST(); 




var group = new GlideRecord('sys_user_group'); 
group.addNotNullQuery('x_pd_integration_pagerduty_escalation'); 
group.query(); 
while (group.next()) { 
	gs.debug("Group {0} {1}", group.name, group.x_pd_integration_pagerduty_escalation); 
	//gs.debug("User "+ pd.getUserEmailByPDID("PZV0GSG")); 

	var feature = 'escalation_policies/' + group.x_pd_integration_pagerduty_escalation; 

	var response = rest.getREST(feature); 
	var responseBody = response.haveError() ? pd._extractPDIncidentError(response) : response.getBody(); 
	var status = response.getStatusCode(); 
	//gs.debug("{0} response: {1}:{2}", me, status, responseBody); 

	if (status == 200) { 
		var body = this.JSON.decode(response.getBody()); 


	} else if (status == 404) { 
		output += "\nERROR: Escalation Policy for group \"" + group.name + "\" (" + group.x_pd_integration_pagerduty_escalation + ") was not found"; 
	} 

	if (!CIAG) { 
		if (group.x_pd_integration_pagerduty_service == "" || group.x_pd_integration_pagerduty_webhook == "") 
		{ 
			output += "\nERROR: Group \""+group.name+"\" cannot have a blank Service or Webhook"; 
		} 
		else 
		{ 
			feature = 'services/' + group.x_pd_integration_pagerduty_service; 

			response = rest.getREST(feature); 
			responseBody = response.haveError() ? pd._extractPDIncidentError(response) : response.getBody(); 
			status = response.getStatusCode(); 
			//gs.debug("{0} response: {1}:{2}", me, status, responseBody); 

			if (status == 200) { 
				var body = this.JSON.decode(response.getBody()); 
				services.push(""+group.x_pd_integration_pagerduty_service);
			} else if (status == 404) { 
				output += "\nERROR: Service for group \"" + group.name + "\" (" + group.x_pd_integration_pagerduty_service + ") was not found"; 
			} 

			feature = 'extensions/' + group.x_pd_integration_pagerduty_webhook; 

			response = rest.getREST(feature); 
			responseBody = response.haveError() ? pd._extractPDIncidentError(response) : response.getBody(); 
			status = response.getStatusCode(); 
			//gs.debug("{0} response: {1}:{2}", me, status, responseBody); 

			if (status == 200) { 
				var body = this.JSON.decode(response.getBody()); 
				if (body.extension.extension_objects.length > 0)
				{
					var service_id = body.extension.extension_objects[0].id; 
					if (service_id != group.x_pd_integration_pagerduty_service) { 
						output += "\nERROR: Webhook (" + group.x_pd_integration_pagerduty_webhook + ") for group \""+group.name+"\" does not belong to Service (" + group.x_pd_integration_pagerduty_service + ")"; 
					} 
				} else {
					output += "\nERROR: Webhook (" + group.x_pd_integration_pagerduty_webhook + ") for group \""+group.name+"\" does not belong to any Service";
				} 
			} else if (status == 404) { 
				output += "\nERROR: Webhook for group \"" + group.name + "\" (" + group.x_pd_integration_pagerduty_webhook + ") was not found"; 
			} 
		} 
	} 
} 


if (CIAG) { 
	var ci = new GlideRecord('cmdb_ci'); 
	ci.addNotNullQuery('x_pd_integration_pagerduty_service'); 
	ci.addNotNullQuery('x_pd_integration_pagerduty_webhook'); 
	ci.query(); 
	while (ci.next()) { 
		gs.debug("CI {0} {1} {2}", ci.name, ci.x_pd_integration_pagerduty_service, ci.x_pd_integration_pagerduty_webhook); 
		//gs.debug("User "+ pd.getUserEmailByPDID("PZV0GSG")); 

		if (ci.x_pd_integration_pagerduty_service == "" || ci.x_pd_integration_pagerduty_webhook == "") 
		{ 
			output += "\nERROR: CI \""+ci.name+"\" cannot have a blank Service or Webhook"; 
		} 
		else 
		{
			var feature = 'services/' + ci.x_pd_integration_pagerduty_service; 

			var response = rest.getREST(feature); 
			var responseBody = response.haveError() ? pd._extractPDIncidentError(response) : response.getBody(); 
			status = response.getStatusCode(); 
			//gs.debug("{0} response: {1}:{2}", me, status, responseBody); 

			if (status == 200) { 
				var body = this.JSON.decode(response.getBody()); 
				services.push(""+ci.x_pd_integration_pagerduty_service);
			} else if (status == 404) { 
				output += "\nERROR: Service for CI \"" + ci.name + "\" (" + ci.x_pd_integration_pagerduty_service + ") was not found"; 
			} 

			feature = 'extensions/' + ci.x_pd_integration_pagerduty_webhook; 

			response = rest.getREST(feature); 
			responseBody = response.haveError() ? pd._extractPDIncidentError(response) : response.getBody(); 
			status = response.getStatusCode(); 
			//gs.debug("{0} response: {1}:{2}", me, status, responseBody); 

			if (status == 200) { 
				var body = this.JSON.decode(response.getBody()); 
				if (body.extension.extension_objects.length > 0)
				{
					var service_id = body.extension.extension_objects[0].id; 
					if (service_id != ci.x_pd_integration_pagerduty_service) { 
						output += "\nERROR: Webhook (" + ci.x_pd_integration_pagerduty_webhook + ") for CI \""+ci.name+"\" does not belong to Service (" + ci.x_pd_integration_pagerduty_service + ")"; 
					}
				}  else {
					output += "\nERROR: Webhook (" + ci.x_pd_integration_pagerduty_webhook + ") for CI \""+ci.name+"\" does not belong to any Service";
				} 

			} else if (status == 404) { 
				output += "\nERROR: Webhook for CI \"" + ci.name + "\" (" + ci.x_pd_integration_pagerduty_webhook + ") was not found"; 
			}
		}			
	} 
} 
//gs.debug("services="+this.JSON.encode(services));
{
		var feature = 'extensions/'; 

		var response = rest.getREST(feature); 
		var responseBody = response.haveError() ? pd._extractPDIncidentError(response) : response.getBody(); 
		status = response.getStatusCode(); 
		//gs.debug("{0} response: {1}:{2}", me, status, responseBody); 

		if (status == 200) { 
			var body = this.JSON.decode(response.getBody()); 
			
			for (i=0;i<body.extensions.length;i++)
			{
				//gs.debug("extensions[{0}]={1}", i, body.extensions[i].extension_schema.summary);
				if (body.extensions[i].extension_schema.summary.substring(0,10) == "ServiceNow" && 
				services.indexOf(body.extensions[i].extension_objects[0].id) == -1)
				{
					if (body.extensions[i].config.target.contains(gs.getProperty('glide.servlet.uri')))
					{
						//gs.debug("body.extensions[i].config.target="+body.extensions[i].config.target);
						output += "\nWARNING: Service \""+body.extensions[i].extension_objects[0].summary+"\" ("+body.extensions[i].extension_objects[0].id+") has a ServiceNow Extension but no provisioned elements in ServiceNow"
					}
				}
			}

		} 
}
output += "\nValidation complete";
gs.info("\n\n\n" + output); 
