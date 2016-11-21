# PickCD

Enabling a peer-to-peer parcel delivery system by creating a marketplace through an online app and webapplication.

## APIs

### User APIs

* Get Customer profile (including favorite Locations)

```
URL: account/register
METHOD: POST
Content-Type:application/json
Request:
{
	"userName":"Sunny",
	"password":"sunny"
}
RESPONSE Success:
	STATUS: 200 OK
	RESPONSE JSON Body:
   {
		"userId": 12
   }
RESPONSE Failure:
	STATUS: 409 CONFLICT
	RESPONSE JSON Body:
   {
		"ERROR": "error"
   }
```

### Delivery APIs

* Get favorite location for a given current location (Homescreen Pickup box):
	If this API returns null, show current location in pickup box, else show Favorite loc name
* Get drop for a pickup location (Homescreen)
* Get google map geo search, for keywords (add city and country)
	Returns list of options
* Get List of previous Pickup (minus favorite locations can be done on Client side)
* Get List of previous Drops (minus favorite locations can be done on Client side)






[PickCD](http://pickcd.com)
**Bold**
*Italic*

