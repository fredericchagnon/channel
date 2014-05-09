exports.listCodes = function() {
	var list = {
		"AF" : {
			name : "Afghanistan"
		},
		"AX" : {
			name : "Åland Islands"
		},
		"AL" : {
			name : "Albania"
		},
		"DZ" : {
			name : "Algeria"
		},
		"AS" : {
			name : "American Samoa"
		},
		"AD" : {
			name : "Andorra"
		},
		"AO" : {
			name : "Angola"
		},
		"AI" : {
			name : "Anguilla"
		},
		"AQ" : {
			name : "Antarctica"
		},
		"AG" : {
			name : "Antigua and Barbuda"
		},
		"AR" : {
			name : "Argentina"
		},
		"AM" : {
			name : "Armenia"
		},
		"AW" : {
			name : "Aruba"
		},
		"AU" : {
			name : "Australia"
		},
		"AT" : {
			name : "Austria"
		},
		"AZ" : {
			name : "Azerbaijan"
		},
		"BS" : {
			name : "Bahamas"
		},
		"BH" : {
			name : "Bahrain"
		},
		"BD" : {
			name : "Bangladesh"
		},
		"BB" : {
			name : "Barbados"
		},
		"BY" : {
			name : "Belarus"
		},
		"BE" : {
			name : "Belgium"
		},
		"BZ" : {
			name : "Belize"
		},
		"BJ" : {
			name : "Benin"
		},
		"BM" : {
			name : "Bermuda"
		},
		"BT" : {
			name : "Bhutan"
		},
		"BO" : {
			name : "Bolivia"
		},
		"BA" : {
			name : "Bosnia and Herzegovina"
		},
		"BW" : {
			name : "Botswana"
		},
		"BV" : {
			name : "Bouvet Island"
		},
		"BR" : {
			name : "Brazil"
		},
		"IO" : {
			name : "British Indian Ocean Territory"
		},
		"BN" : {
			name : "Brunei Darussalam"
		},
		"BG" : {
			name : "Bulgaria"
		},
		"BF" : {
			name : "Burkina Faso"
		},
		"BI" : {
			name : "Burundi"
		},
		"KH" : {
			name : "Cambodia"
		},
		"CM" : {
			name : "Cameroon"
		},
		"CA" : {
			name : "Canada"
		},
		"CV" : {
			name : "Cape Verde"
		},
		"KY" : {
			name : "Cayman Islands"
		},
		"CF" : {
			name : "Central African Republic"
		},
		"TD" : {
			name : "Chad"
		},
		"CL" : {
			name : "Chile"
		},
		"CN" : {
			name : "China"
		},
		"CX" : {
			name : "Christmas Island"
		},
		"CC" : {
			name : "Cocos (Keeling) Islands"
		},
		"CO" : {
			name : "Colombia"
		},
		"KM" : {
			name : "Comoros"
		},
		"CG" : {
			name : "Congo"
		},
		"CD" : {
			name : "Congo, The Democratic Republic of The"
		},
		"CK" : {
			name : "Cook Islands"
		},
		"CR" : {
			name : "Costa Rica"
		},
		"CI" : {
			name : "Cote D'ivoire"
		},
		"HR" : {
			name : "Croatia"
		},
		"CU" : {
			name : "Cuba"
		},
		"CY" : {
			name : "Cyprus"
		},
		"CZ" : {
			name : "Czech Republic"
		},
		"DK" : {
			name : "Denmark"
		},
		"DJ" : {
			name : "Djibouti"
		},
		"DM" : {
			name : "Dominica"
		},
		"DO" : {
			name : "Dominican Republic"
		},
		"EC" : {
			name : "Ecuador"
		},
		"EG" : {
			name : "Egypt"
		},
		"SV" : {
			name : "El Salvador"
		},
		"GQ" : {
			name : "Equatorial Guinea"
		},
		"ER" : {
			name : "Eritrea"
		},
		"EE" : {
			name : "Estonia"
		},
		"ET" : {
			name : "Ethiopia"
		},
		"FK" : {
			name : "Falkland Islands (Malvinas)"
		},
		"FO" : {
			name : "Faroe Islands"
		},
		"FJ" : {
			name : "Fiji"
		},
		"FI" : {
			name : "Finland"
		},
		"FR" : {
			name : "France"
		},
		"GF" : {
			name : "French Guiana"
		},
		"PF" : {
			name : "French Polynesia"
		},
		"TF" : {
			name : "French Southern Territories"
		},
		"GA" : {
			name : "Gabon"
		},
		"GM" : {
			name : "Gambia"
		},
		"GE" : {
			name : "Georgia"
		},
		"DE" : {
			name : "Germany"
		},
		"GH" : {
			name : "Ghana"
		},
		"GI" : {
			name : "Gibraltar"
		},
		"GR" : {
			name : "Greece"
		},
		"GL" : {
			name : "Greenland"
		},
		"GD" : {
			name : "Grenada"
		},
		"GP" : {
			name : "Guadeloupe"
		},
		"GU" : {
			name : "Guam"
		},
		"GT" : {
			name : "Guatemala"
		},
		"GG" : {
			name : "Guernsey"
		},
		"GN" : {
			name : "Guinea"
		},
		"GW" : {
			name : "Guinea-bissau"
		},
		"GY" : {
			name : "Guyana"
		},
		"HT" : {
			name : "Haiti"
		},
		"HM" : {
			name : "Heard Island and Mcdonald Islands"
		},
		"VA" : {
			name : "Holy See (Vatican City State)"
		},
		"HN" : {
			name : "Honduras"
		},
		"HK" : {
			name : "Hong Kong"
		},
		"HU" : {
			name : "Hungary"
		},
		"IS" : {
			name : "Iceland"
		},
		"IN" : {
			name : "India"
		},
		"ID" : {
			name : "Indonesia"
		},
		"IR" : {
			name : "Iran, Islamic Republic of"
		},
		"IQ" : {
			name : "Iraq"
		},
		"IE" : {
			name : "Ireland"
		},
		"IM" : {
			name : "Isle of Man"
		},
		"IL" : {
			name : "Israel"
		},
		"IT" : {
			name : "Italy"
		},
		"JM" : {
			name : "Jamaica"
		},
		"JP" : {
			name : "Japan"
		},
		"JE" : {
			name : "Jersey"
		},
		"JO" : {
			name : "Jordan"
		},
		"KZ" : {
			name : "Kazakhstan"
		},
		"KE" : {
			name : "Kenya"
		},
		"KI" : {
			name : "Kiribati"
		},
		"KP" : {
			name : "Korea, Democratic People's Republic of"
		},
		"KR" : {
			name : "Korea, Republic of"
		},
		"KW" : {
			name : "Kuwait"
		},
		"KG" : {
			name : "Kyrgyzstan"
		},
		"LA" : {
			name : "Lao People's Democratic Republic"
		},
		"LV" : {
			name : "Latvia"
		},
		"LB" : {
			name : "Lebanon"
		},
		"LS" : {
			name : "Lesotho"
		},
		"LR" : {
			name : "Liberia"
		},
		"LY" : {
			name : "Libyan Arab Jamahiriya"
		},
		"LI" : {
			name : "Liechtenstein"
		},
		"LT" : {
			name : "Lithuania"
		},
		"LU" : {
			name : "Luxembourg"
		},
		"MO" : {
			name : "Macao"
		},
		"MK" : {
			name : "Macedonia, The Former Yugoslav Republic of"
		},
		"MG" : {
			name : "Madagascar"
		},
		"MW" : {
			name : "Malawi"
		},
		"MY" : {
			name : "Malaysia"
		},
		"MV" : {
			name : "Maldives"
		},
		"ML" : {
			name : "Mali"
		},
		"MT" : {
			name : "Malta"
		},
		"MH" : {
			name : "Marshall Islands"
		},
		"MQ" : {
			name : "Martinique"
		},
		"MR" : {
			name : "Mauritania"
		},
		"MU" : {
			name : "Mauritius"
		},
		"YT" : {
			name : "Mayotte"
		},
		"MX" : {
			name : "Mexico"
		},
		"FM" : {
			name : "Micronesia, Federated States of"
		},
		"MD" : {
			name : "Moldova, Republic of"
		},
		"MC" : {
			name : "Monaco"
		},
		"MN" : {
			name : "Mongolia"
		},
		"ME" : {
			name : "Montenegro"
		},
		"MS" : {
			name : "Montserrat"
		},
		"MA" : {
			name : "Morocco"
		},
		"MZ" : {
			name : "Mozambique"
		},
		"MM" : {
			name : "Myanmar"
		},
		"NA" : {
			name : "Namibia"
		},
		"NR" : {
			name : "Nauru"
		},
		"NP" : {
			name : "Nepal"
		},
		"NL" : {
			name : "Netherlands"
		},
		"AN" : {
			name : "Netherlands Antilles"
		},
		"NC" : {
			name : "New Caledonia"
		},
		"NZ" : {
			name : "New Zealand"
		},
		"NI" : {
			name : "Nicaragua"
		},
		"NE" : {
			name : "Niger"
		},
		"NG" : {
			name : "Nigeria"
		},
		"NU" : {
			name : "Niue"
		},
		"NF" : {
			name : "Norfolk Island"
		},
		"MP" : {
			name : "Northern Mariana Islands"
		},
		"NO" : {
			name : "Norway"
		},
		"OM" : {
			name : "Oman"
		},
		"PK" : {
			name : "Pakistan"
		},
		"PW" : {
			name : "Palau"
		},
		"PS" : {
			name : "Palestinian Territory, Occupied"
		},
		"PA" : {
			name : "Panama"
		},
		"PG" : {
			name : "Papua New Guinea"
		},
		"PY" : {
			name : "Paraguay"
		},
		"PE" : {
			name : "Peru"
		},
		"PH" : {
			name : "Philippines"
		},
		"PN" : {
			name : "Pitcairn"
		},
		"PL" : {
			name : "Poland"
		},
		"PT" : {
			name : "Portugal"
		},
		"PR" : {
			name : "Puerto Rico"
		},
		"QA" : {
			name : "Qatar"
		},
		"RE" : {
			name : "Reunion"
		},
		"RO" : {
			name : "Romania"
		},
		"RU" : {
			name : "Russian Federation"
		},
		"RW" : {
			name : "Rwanda"
		},
		"SH" : {
			name : "Saint Helena"
		},
		"KN" : {
			name : "Saint Kitts and Nevis"
		},
		"LC" : {
			name : "Saint Lucia"
		},
		"PM" : {
			name : "Saint Pierre and Miquelon"
		},
		"VC" : {
			name : "Saint Vincent and The Grenadines"
		},
		"WS" : {
			name : "Samoa"
		},
		"SM" : {
			name : "San Marino"
		},
		"ST" : {
			name : "Sao Tome and Principe"
		},
		"SA" : {
			name : "Saudi Arabia"
		},
		"SN" : {
			name : "Senegal"
		},
		"RS" : {
			name : "Serbia"
		},
		"SC" : {
			name : "Seychelles"
		},
		"SL" : {
			name : "Sierra Leone"
		},
		"SG" : {
			name : "Singapore"
		},
		"SK" : {
			name : "Slovakia"
		},
		"SI" : {
			name : "Slovenia"
		},
		"SB" : {
			name : "Solomon Islands"
		},
		"SO" : {
			name : "Somalia"
		},
		"ZA" : {
			name : "South Africa"
		},
		"GS" : {
			name : "South Georgia and The South Sandwich Islands"
		},
		"ES" : {
			name : "Spain"
		},
		"LK" : {
			name : "Sri Lanka"
		},
		"SD" : {
			name : "Sudan"
		},
		"SR" : {
			name : "Suriname"
		},
		"SJ" : {
			name : "Svalbard and Jan Mayen"
		},
		"SZ" : {
			name : "Swaziland"
		},
		"SE" : {
			name : "Sweden"
		},
		"CH" : {
			name : "Switzerland"
		},
		"SY" : {
			name : "Syrian Arab Republic"
		},
		"TW" : {
			name : "Taiwan, Province of China"
		},
		"TJ" : {
			name : "Tajikistan"
		},
		"TZ" : {
			name : "Tanzania, United Republic of"
		},
		"TH" : {
			name : "Thailand"
		},
		"TL" : {
			name : "Timor-leste"
		},
		"TG" : {
			name : "Togo"
		},
		"TK" : {
			name : "Tokelau"
		},
		"TO" : {
			name : "Tonga"
		},
		"TT" : {
			name : "Trinidad and Tobago"
		},
		"TN" : {
			name : "Tunisia"
		},
		"TR" : {
			name : "Turkey"
		},
		"TM" : {
			name : "Turkmenistan"
		},
		"TC" : {
			name : "Turks and Caicos Islands"
		},
		"TV" : {
			name : "Tuvalu"
		},
		"UG" : {
			name : "Uganda"
		},
		"UA" : {
			name : "Ukraine"
		},
		"AE" : {
			name : "United Arab Emirates"
		},
		"GB" : {
			name : "United Kingdom"
		},
		"US" : {
			name : "United States"
		},
		"UM" : {
			name : "United States Minor Outlying Islands"
		},
		"UY" : {
			name : "Uruguay"
		},
		"UZ" : {
			name : "Uzbekistan"
		},
		"VU" : {
			name : "Vanuatu"
		},
		"VE" : {
			name : "Venezuela"
		},
		"VN" : {
			name : "Viet Nam"
		},
		"VG" : {
			name : "Virgin Islands, British"
		},
		"VI" : {
			name : "Virgin Islands, U.S."
		},
		"WF" : {
			name : "Wallis and Futuna"
		},
		"EH" : {
			name : "Western Sahara"
		},
		"YE" : {
			name : "Yemen"
		},
		"ZM" : {
			name : "Zambia"
		},
		"ZW" : {
			name : "Zimbabwe"
		},
	};
	countryCodeToRegionCodeMap = {
		1 : ["US", "AG", "AI", "AS", "BB", "BM", "BS", "CA", "DM", "DO", "GD", "GU", "JM", "KN", "KY", "LC", "MP", "MS", "PR", "TC", "TT", "VC", "VG", "VI"],
		7 : ["RU", "KZ"],
		20 : ["EG"],
		27 : ["ZA"],
		30 : ["GR"],
		31 : ["NL"],
		32 : ["BE"],
		33 : ["FR"],
		34 : ["ES"],
		36 : ["HU"],
		39 : ["IT"],
		40 : ["RO"],
		41 : ["CH"],
		43 : ["AT"],
		44 : ["GB", "GG", "IM", "JE"],
		45 : ["DK"],
		46 : ["SE"],
		47 : ["NO", "SJ"],
		48 : ["PL"],
		49 : ["DE"],
		51 : ["PE"],
		52 : ["MX"],
		53 : ["CU"],
		54 : ["AR"],
		55 : ["BR"],
		56 : ["CL"],
		57 : ["CO"],
		58 : ["VE"],
		60 : ["MY"],
		61 : ["AU", "CC", "CX"],
		62 : ["ID"],
		63 : ["PH"],
		64 : ["NZ"],
		65 : ["SG"],
		66 : ["TH"],
		81 : ["JP"],
		82 : ["KR"],
		84 : ["VN"],
		86 : ["CN"],
		90 : ["TR"],
		91 : ["IN"],
		92 : ["PK"],
		93 : ["AF"],
		94 : ["LK"],
		95 : ["MM"],
		98 : ["IR"],
		212 : ["MA"],
		213 : ["DZ"],
		216 : ["TN"],
		218 : ["LY"],
		220 : ["GM"],
		221 : ["SN"],
		222 : ["MR"],
		223 : ["ML"],
		224 : ["GN"],
		225 : ["CI"],
		226 : ["BF"],
		227 : ["NE"],
		228 : ["TG"],
		229 : ["BJ"],
		230 : ["MU"],
		231 : ["LR"],
		232 : ["SL"],
		233 : ["GH"],
		234 : ["NG"],
		235 : ["TD"],
		236 : ["CF"],
		237 : ["CM"],
		238 : ["CV"],
		239 : ["ST"],
		240 : ["GQ"],
		241 : ["GA"],
		242 : ["CG"],
		243 : ["CD"],
		244 : ["AO"],
		245 : ["GW"],
		246 : ["IO"],
		247 : ["AC"],
		248 : ["SC"],
		249 : ["SD"],
		250 : ["RW"],
		251 : ["ET"],
		252 : ["SO"],
		253 : ["DJ"],
		254 : ["KE"],
		255 : ["TZ"],
		256 : ["UG"],
		257 : ["BI"],
		258 : ["MZ"],
		260 : ["ZM"],
		261 : ["MG"],
		262 : ["RE", "YT"],
		263 : ["ZW"],
		264 : ["NA"],
		265 : ["MW"],
		266 : ["LS"],
		267 : ["BW"],
		268 : ["SZ"],
		269 : ["KM"],
		290 : ["SH"],
		291 : ["ER"],
		297 : ["AW"],
		298 : ["FO"],
		299 : ["GL"],
		350 : ["GI"],
		351 : ["PT"],
		352 : ["LU"],
		353 : ["IE"],
		354 : ["IS"],
		355 : ["AL"],
		356 : ["MT"],
		357 : ["CY"],
		358 : ["FI", "AX"],
		359 : ["BG"],
		370 : ["LT"],
		371 : ["LV"],
		372 : ["EE"],
		373 : ["MD"],
		374 : ["AM"],
		375 : ["BY"],
		376 : ["AD"],
		377 : ["MC"],
		378 : ["SM"],
		379 : ["VA"],
		380 : ["UA"],
		381 : ["RS"],
		382 : ["ME"],
		385 : ["HR"],
		386 : ["SI"],
		387 : ["BA"],
		389 : ["MK"],
		420 : ["CZ"],
		421 : ["SK"],
		423 : ["LI"],
		500 : ["FK"],
		501 : ["BZ"],
		502 : ["GT"],
		503 : ["SV"],
		504 : ["HN"],
		505 : ["NI"],
		506 : ["CR"],
		507 : ["PA"],
		508 : ["PM"],
		509 : ["HT"],
		590 : ["GP", "BL", "MF"],
		591 : ["BO"],
		592 : ["GY"],
		593 : ["EC"],
		594 : ["GF"],
		595 : ["PY"],
		596 : ["MQ"],
		597 : ["SR"],
		598 : ["UY"],
		599 : ["AN"],
		670 : ["TL"],
		672 : ["NF"],
		673 : ["BN"],
		674 : ["NR"],
		675 : ["PG"],
		676 : ["TO"],
		677 : ["SB"],
		678 : ["VU"],
		679 : ["FJ"],
		680 : ["PW"],
		681 : ["WF"],
		682 : ["CK"],
		683 : ["NU"],
		685 : ["WS"],
		686 : ["KI"],
		687 : ["NC"],
		688 : ["TV"],
		689 : ["PF"],
		690 : ["TK"],
		691 : ["FM"],
		692 : ["MH"],
		850 : ["KP"],
		852 : ["HK"],
		853 : ["MO"],
		855 : ["KH"],
		856 : ["LA"],
		880 : ["BD"],
		886 : ["TW"],
		960 : ["MV"],
		961 : ["LB"],
		962 : ["JO"],
		963 : ["SY"],
		964 : ["IQ"],
		965 : ["KW"],
		966 : ["SA"],
		967 : ["YE"],
		968 : ["OM"],
		970 : ["PS"],
		971 : ["AE"],
		972 : ["IL"],
		973 : ["BH"],
		974 : ["QA"],
		975 : ["BT"],
		976 : ["MN"],
		977 : ["NP"],
		992 : ["TJ"],
		993 : ["TM"],
		994 : ["AZ"],
		995 : ["GE"],
		996 : ["KG"],
		998 : ["UZ"]
	};
	for (i in countryCodeToRegionCodeMap) {
		var countries = countryCodeToRegionCodeMap[i];
		for (j in countries) {
			var country = list[countries[j]];
			if (typeof country == 'undefined') {
				country = {name:countries[j]};
				list[countries[j]]=country;
			}
			country['prefix'] = '+'+i;
			country['code'] = countries[j];
		}
	}
	return [list, countryCodeToRegionCodeMap];
};