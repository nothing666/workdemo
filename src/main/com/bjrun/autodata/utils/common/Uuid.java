package com.bjrun.autodata.utils.common;

import java.util.UUID;

public abstract class Uuid {

	public static String id32() {
		String uuid = UUID.randomUUID().toString();
		uuid = uuid.replaceAll("-", "");
		if (uuid.length() > 32) {
			uuid = uuid.substring(32);
		}
		return uuid;
	}
}
