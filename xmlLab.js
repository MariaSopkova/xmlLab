// JavaScript source code
var xmlDoc;

window.onload = function ()
{
    document.getElementById("NewType").value = 0;
    document.getElementById("NewValue").value = "Add value";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "Input.xml", false);
    xmlhttp.send();
    xmlDoc = xmlhttp.responseXML;
    if (xmlDoc)
    {
        xmlParser(xmlDoc);
    }
}

function printParameter(element)
{
    var html_element = document.createElement("p");
    html_element.setAttribute("class", "Parameter");
    html_element.setAttribute("id", element.id);
    html_element.setAttribute("Name", element.name);
    html_element.setAttribute("Description", element.description);
    html_element.setAttribute("type", element.type);
    html_element.setAttribute("value", element.value);
    document.getElementById("Content").appendChild(html_element);
    var form_type = getFormValue(element.type, element.value);
    var string_to_show = "<input name=\"DeleteButton\" type=\"button\" value=\"Delete\" onclick=\'deleteParameter(this.parentNode)\'/>";
    string_to_show += " Id: ".bold() + element.id + "; Name: ".bold() + element.name
                            + "; Description: ".bold() + element.description + form_type + "</br>";
    html_element.innerHTML = string_to_show;
}
function getFormValue(type, value)
{
    var string_to_return = "; Type: ".bold() + type + "; Value: ".bold();
    switch (type)
    {
        case 'String':
            if (value === "")
                return string_to_return + "<input onChange=\'setElementValue(this, this.parentNode)\' type=\'text\' />";
            return string_to_return + "<input onChange=\'setElementValue(this, this.parentNode)\' type=\'text\' value=\'" + value + "\' />";
        case 'Int32':
            return string_to_return + "<input onChange=\'setElementValue(this, this.parentNode)\' type=\'number\' value=" + value + " />";
        case 'Boolean':
            var checkbox = "";
            if (value === "True" )
                checkbox = "checked";
            return string_to_return + "<input onChange=\'setElementValue(this, this.parentNode)\' type=\'checkbox\'" + checkbox + "/>";
    }
}
function xmlParser(xml_doc)
{
    var params = xml_doc.getElementsByTagName("Parameter");
    for (var i = 0; i < params.length; i++)
    {
        var element = new Object();
        element.id = params[i].getElementsByTagName("Id")[0].firstChild.nodeValue;
        element.name = params[i].getElementsByTagName("Name")[0].firstChild.nodeValue;
        element.description = params[i].getElementsByTagName("Description")[0].firstChild.nodeValue;
        element.type = params[i].getElementsByTagName("Type")[0].firstChild.nodeValue;
        element.type = element.type.replace('System.', '');
        element.value = params[i].getElementsByTagName("Value")[0].firstChild.nodeValue;
        printParameter(element);
    }
}

function setElementValue(child_node, parent_node)
{
    if (parent_node.getAttribute("type") == "Boolean")
    {
        if( child_node.checked )
            parent_node.setAttribute('value', "True");
        else
            parent_node.setAttribute('value', "False");
    }
    else
    {
        parent_node.setAttribute('value', child_node.value);
    }
}

function deleteParameter( child_node )
{
    child_node.parentNode.removeChild(child_node);
}

function addParameter()
{
    document.getElementById("NewParameter").hidden = false;
    document.getElementById("AddButton").hidden = "hidden";
    document.getElementById("DownloadButton").hidden = "hidden";
}

function canselParameter()
{
    document.getElementById("NewParameter").hidden = "hidden";
    document.getElementById("AddButton").hidden = false;
    document.getElementById("DownloadButton").hidden = false;
}

function saveParameter()
{
    var form = document.getElementById("NewParameter")
    var element = new Object();
    element.id = document.getElementById("NewId").value;
    element.name = document.getElementById("NewName").value;
    element.description = document.getElementById("NewDescription").value;
    element.type = getTypeFromCombobox();
    element.value = getNewValue(element.type);
    printParameter(element);
    canselParameter();
}

function getTypeFromCombobox()
{
    var current_type = document.getElementById("NewType").value;
    switch (current_type)
    {
        case "0":
            return "String";
        case "1":
            return "Int32";
        case "2":
            return "Boolean";
    }
}

function getNewValue( type ) {
    switch (type) {
        case "String":
        case "Int32":
        {
            return document.getElementById("NewValue").value;
        }
        case "Boolean":
        {
            if (document.getElementById("NewValue").checked)
            {
                return "True";
            }
            else
            {
                return "False";
            }
        }
    }
}

function changeType()
{
    var current_type = document.getElementById("NewType").value;
    if (current_type == "0")
    {
        document.getElementById("NewValue").setAttribute("type", "text");
        document.getElementById("NewValue").value = "Add value";
        return;
    }
    if (current_type == "1") {
        document.getElementById("NewValue").setAttribute("type", "number");
        document.getElementById("NewValue").value = 0;
        return;
    }
    else
    {
        document.getElementById("NewValue").setAttribute("type", "checkbox");
        document.getElementById("NewValue").value = "";
    }
}

function generateOutputXML()
{
    var content = document.getElementById("Content").getElementsByTagName("p");
    var xmlStr = "<?xml version=\"1.0\"?>\n";
    xmlStr += "<Parameters>\n";
    for (var i = 0; i < content.length; i++)
    {
        type = content[i].getAttribute("type");
        xmlStr += "<Parameter>\n";
        xmlStr += "<Id>" + content[i].getAttribute("id") + "</Id>\n";
        xmlStr += "<Name>" + content[i].getAttribute("name") + "</Name>\n";
        xmlStr += "<Description>" + content[i].getAttribute("description") + "</Description>\n";
        xmlStr += "<Type>System." + type;
        xmlStr += "</Type>\n";
        xmlStr += "<Value>" + getValueForOutput( type, content[i].getAttribute("value")) + "</Value>\n";
        xmlStr += "</Parameter>";
    }
    xmlStr += "</Parameters>";
    return xmlStr;
}

function getValueForOutput(type, value)
{
    /*switch (type)
    {
        case "String":
        case "Int32":
        {
            return value;
        }
        case "Boolean":
        {
            if (value == "on")
            {
                return "True";
            }
            else
            {
                return "False";
            }
        }
}*/
    return value;
}

function download(fileName, type) {

    var text = generateOutputXML();
    var file = new Blob([text], { type: type });
    var linkToFile = document.getElementById("linkToFile");
    linkToFile.href = URL.createObjectURL(file);
    linkToFile.download = fileName;
    document.getElementById('linkToFile').click();
}

