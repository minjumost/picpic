package net.minipia.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import net.minipia.entity.Object;
import net.minipia.entity.Room;

@Repository
public interface ObjectRepository extends JpaRepository<Object, Long> {
	List<Object> findAllByType(Byte type);
}
