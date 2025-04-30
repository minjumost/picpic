package net.minipia.service;

import java.util.Random;

import org.springframework.stereotype.Service;

import net.minipia.apiPayload.code.status.ErrorStatus;
import net.minipia.apiPayload.exception.NotFoundException;
import net.minipia.dto.CreateRoomResponseDTO;
import net.minipia.entity.Room;
import net.minipia.repository.RoomRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {

	private final RoomRepository roomRepository;
	private static final char[] BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".toCharArray();
	private static final int CODE_LENGTH = 8;
	private static final Random RANDOM = new Random();

	@Override
	public CreateRoomResponseDTO createRoom() {
		String code;
		do {
			StringBuilder sb = new StringBuilder(CODE_LENGTH);
			for (int i = 0; i < CODE_LENGTH; i++) {
				sb.append(BASE62[RANDOM.nextInt(BASE62.length)]);
			}
			code = sb.toString().toLowerCase();
		} while (roomRepository.existsByCode(code));

		Room room = Room.builder()
			.code(code)
			.build();

		roomRepository.save(room);

		return CreateRoomResponseDTO.builder().code(code).build();
	}

	@Override
	public void enterRoom(String code) {
		
		Room room = roomRepository.findByCode(code)
			.orElseThrow(() -> new NotFoundException(ErrorStatus.INVALID_ROOM_CODE));

		log.info("[방 입장] code={}", code);
	}
}
