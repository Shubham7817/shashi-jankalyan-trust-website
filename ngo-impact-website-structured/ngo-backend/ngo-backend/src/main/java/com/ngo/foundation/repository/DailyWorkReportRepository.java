package com.ngo.foundation.repository;

import com.ngo.foundation.entity.DailyWorkReport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DailyWorkReportRepository extends JpaRepository<DailyWorkReport, Long> {
    List<DailyWorkReport> findByUser_IdOrderByActivityDateDesc(Long userId);
    List<DailyWorkReport> findAllByOrderByActivityDateDesc();
}