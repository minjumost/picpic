package net.minipia.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import net.minipia.entity.Room;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

	boolean existsByCode(String code);

	Optional<Room> findByCode(String code);
}
