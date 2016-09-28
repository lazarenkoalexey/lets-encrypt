//@auth
//@required('url', 'scriptName', 'scriptType')

import com.hivext.api.core.utils.Transport;
import com.hivext.api.utils.Random;

//reading script from URL
var scriptBody = new Transport().get(url);

//inject token
var token = Random.getPswd(64);
scriptBody = scriptBody.replace("${TOKEN}", token);
scriptBody = scriptBody.replace("${ENV_DOMAIN}", "${env.domain}");
scriptBody = scriptBody.replace("${USER_EMAIL}", "${user.email}");
scriptBody = scriptBody.replace("${ENV_APPID}", "${env.appid}");

//delete the script if it exists already
jelastic.dev.scripting.DeleteScript(scriptName);

//create a new script 
var resp = hivext.dev.scripting.CreateScript(scriptName, scriptType, scriptBody);
if (resp.result != 0) return resp;

//get app domain
var domain = jelastic.dev.apps.GetApp(appid).hosting.domain;

//eval the script 
var resp = hivext.dev.scripting.Eval(scriptName, {
    token: token,
    domain: '${settings.customdomain}',
    urlLeScript: 'https://raw.githubusercontent.com/jelastic-jps/lets-encrypt/master/install-le.sh',
    urlGenScript: 'https://raw.githubusercontent.com/jelastic-jps/lets-encrypt/master/generate-ssl-cert.sh',
    envName: '${env.envName}'
});
return resp;
    
//     "cmd": "wget -qO http://${this.domain}/install-ssl-script?token=${this.token}&domain=${settings.customdomain}&urlLeScript=https://raw.githubusercontent.com/jelastic-jps/lets-encrypt/master/install-le.sh&urlGenScript=https://raw.githubusercontent.com/jelastic-jps/lets-encrypt/master/generate-ssl-cert.sh >> /var/log/run.log"

/*
return {
    result: 0,
    onAfterReturn : {
        call : {
            procedure : next,
            params : {
                domain : domain,
                token : token
            }
        }
    }
}
*/