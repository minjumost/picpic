package net.minipia.apiPayload.exception;

import net.minipia.apiPayload.code.BaseErrorCode;

public class NotFoundException extends GeneralException {
	
	public NotFoundException(BaseErrorCode code) {
		super(code);
	}
}
