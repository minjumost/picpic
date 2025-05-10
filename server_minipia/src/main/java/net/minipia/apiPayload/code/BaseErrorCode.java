package net.minipia.apiPayload.code;

public interface BaseErrorCode {
	public ErrorReasonDTO getReason();
	public ErrorReasonDTO getReasonHttpStatus();
}